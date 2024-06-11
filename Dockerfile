FROM ubuntu:jammy-20240427

# Set the working directory
WORKDIR /usr/src/app

# Copy and install system dependencies
RUN apt update && apt install -y python3 python3-pip \
    libpcre3-dev libssl-dev perl make build-essential zlib1g-dev git haproxy wget adduser libfontconfig1 musl

# Install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

RUN wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
RUN wget https://openresty.org/download/openresty-1.25.3.1.tar.gz 
RUN git clone https://github.com/vozlt/nginx-module-vts 

RUN tar -xvf ffmpeg-release-amd64-static.tar.xz \
    && cd ffmpeg* \
    && mv ffmpeg ffprobe /usr/bin/ \
    && cd .. && rm -r ffmpeg*

# Install OpenResty and VTS module
RUN tar -zxf openresty-1.25.3.1.tar.gz \
    && cd openresty-1.25.3.1 && ./configure --add-module=../nginx-module-vts && make && make install \
    && cd .. && rm -rf openresty* nginx-module-vts* \
    && mkdir -p /var/log/nginx \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && mkdir -p /var/www/edge1 \
    && mkdir -p /var/www/edge2 \
    && mkdir -p /var/www/edge3

# Copy application files
COPY . .

# Copy configuration files
RUN rm /usr/local/openresty/nginx/conf/*
COPY configs/nginx.conf.d /usr/local/openresty/nginx/conf/
COPY configs/haproxy.cfg /etc/haproxy/

# Expose ports
EXPOSE 1935 3000 8888

# Start services
CMD ["/bin/bash", "-c", "service haproxy start && /usr/local/openresty/nginx/sbin/nginx -c /usr/local/openresty/nginx/conf/nginx.conf && python3 /usr/src/app/transcode_servers/servers.py && /usr/src/app/monitor/prometheus/node_exporter && /usr/src/app/monitor/prometheus/prometheus --config.file=./dev-prometheus.yml"]
