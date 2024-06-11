package main

import (
	"bytes"
	"testing"
)

func TestStore(t *testing.T) {
	var opts StoreOpts = StoreOpts{
		PathTransformFunc: CASPathTransformFunc,
	}

	store := NewStore(opts)

	data := bytes.NewReader([]byte("some ts file content"))
	if err := store.writeStream("mytsfolder", data); err != nil {
		t.Error(err)
	}
}
