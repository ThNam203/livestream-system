package p2p

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestTCPTransport(t *testing.T) {
	listenAddr := ":4444"
	tr := NewTCPTransport(listenAddr)
	assert.Equal(t, tr.listenAddr, listenAddr)
	assert.Nil(t, tr.ListenAndAccept())
}
