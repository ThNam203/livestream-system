package main

import (
	"bytes"
	"time"

	"github.com/sen1or/dfs/p2p"
)

func setupFileServer(listenAddr string, nodes ...string) *FileServer {
	tcpOpts := p2p.TCPTransportOpts{
		ListenAddr:    listenAddr,
		HandshakeFunc: p2p.NOPHandshakeFunc,
		Decoder:       p2p.DefaultDecoder{},
	}

	tr := p2p.NewTCPTransport(tcpOpts)

	fileServerOpts := FileServerOpts{
		StorageRoot:       listenAddr + "_dfs",
		PathTransformFunc: CASPathTransformFunc,
		Transport:         tr,
		BootstrapNodes:    nodes,
	}

	fileServer := NewFileServer(fileServerOpts)
	tr.OnPeer = fileServer.OnPeer

	return fileServer
}

func main() {
	s1 := setupFileServer(":3000", "")
	s2 := setupFileServer(":4000", ":3000")

	go s1.Start()
	time.Sleep(1 * time.Second)

	go s2.Start()
	time.Sleep(1 * time.Second)

	data := bytes.NewReader([]byte("hahahahaha lmao qua"))
	s2.StoreData("mytestdata", data)
}
