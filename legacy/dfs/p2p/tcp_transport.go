package p2p

import (
	"errors"
	"fmt"
	"log"
	"net"
	"sync"
)

type TCPPeer struct {
	net.Conn

	// if we dial and retrive a conn then outbound = true
	// else if we accept and get a conn then outbount = false
	outbound bool
}

func NewTCPPeer(conn net.Conn, outbound bool) *TCPPeer {
	return &TCPPeer{
		Conn:     conn,
		outbound: outbound,
	}
}

func (t *TCPPeer) Send(b []byte) error {
	_, err := t.Conn.Write(b)
	return err
}

type TCPTransportOpts struct {
	ListenAddr    string
	HandshakeFunc HandshakeFunc
	Decoder       Decoder
	OnPeer        func(Peer) error
}

type TCPTransport struct {
	TCPTransportOpts
	listener   net.Listener
	rpcchannel chan RPC

	// protect peers
	mu    sync.RWMutex
	peers map[net.Addr]Peer
}

func (t *TCPTransport) Dial(addr string) error {
	conn, err := net.Dial("tcp", addr)
	if err != nil {
		return err
	}

	go t.handleTCPConnection(conn, true)
	return nil
}

func NewTCPTransport(opts TCPTransportOpts) *TCPTransport {
	return &TCPTransport{
		TCPTransportOpts: opts,
		rpcchannel:       make(chan RPC, 1024),
	}
}

func (t *TCPTransport) Close() error {
	return t.listener.Close()
}

func (t *TCPTransport) Consume() <-chan RPC {
	return t.rpcchannel
}

func (t *TCPTransport) ListenAndAccept() error {
	var err error
	t.listener, err = net.Listen("tcp", t.ListenAddr)
	if err != nil {
		return err
	}

	log.Printf("TCP transport listening on port %s", t.ListenAddr)

	go t.startAcceptLoop()

	return nil
}

func (t *TCPTransport) startAcceptLoop() {
	for {
		conn, err := t.listener.Accept()

		if errors.Is(err, net.ErrClosed) {
			return
		}

		if err != nil {
			fmt.Printf("TCPTransport accept error %s\n", err)
		}

		go t.handleTCPConnection(conn, false)
	}
}

func (t *TCPTransport) handleTCPConnection(conn net.Conn, outbound bool) {
	var err error
	defer func() {
		fmt.Printf("Closing peer connection: %s", err)
		conn.Close()
	}()

	peer := NewTCPPeer(conn, outbound)

	if err := t.HandshakeFunc(peer); err != nil {
		conn.Close()
		fmt.Printf("TCP handshake error: %s\n", err)
	}

	if t.OnPeer != nil {
		if err = t.OnPeer(peer); err != nil {
			return
		}
	}

	for {
		rpc := &RPC{}

		if err := t.Decoder.Decode(conn, rpc); err != nil {
			fmt.Printf("TCP decode error : %s\n", err)
			continue
		}

		rpc.From = conn.RemoteAddr()
		t.rpcchannel <- *rpc
	}

}
