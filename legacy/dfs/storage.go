package main

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
)

type PathKey struct {
	PathName string
	FileName string
}

func (p PathKey) GetFullPath() string {
	return fmt.Sprintf("%s/%s", p.PathName, p.FileName)
}

type PathTransformFunc func(key string) PathKey

func CASPathTransformFunc(key string) PathKey {
	hash := sha1.Sum([]byte(key))
	hashStr := hex.EncodeToString(hash[:])

	singlePathSize := 5
	sliceLen := len(hashStr) / 5
	paths := make([]string, sliceLen)

	for i := 0; i < sliceLen; i++ {
		from, to := i*singlePathSize, (i*singlePathSize)+singlePathSize
		paths[i] = hashStr[from:to]
	}

	return PathKey{
		PathName: strings.Join(paths, "/"),
		FileName: hashStr,
	}
}

type StoreOpts struct {
	PathTransformFunc PathTransformFunc
	RootPath          string
}

type Store struct {
	StoreOpts
}

func NewStore(opts StoreOpts) *Store {
	return &Store{
		StoreOpts: opts,
	}
}

func (s *Store) Read(key string) (io.Reader, error) {
	f, err := s.readStream(key)
	if err != nil {
		return nil, err
	}

	defer f.Close()

	buf := new(bytes.Buffer)
	_, err = io.Copy(buf, f)

	return buf, err
}

func (s *Store) Write(key string, r io.Reader) error {
	return s.writeStream(key, r)
}

func (s *Store) Has(key string) bool {
	pathKey := s.PathTransformFunc(key)
	fullPathWithRoot := fmt.Sprintf("%s/%s", s.RootPath, pathKey.GetFullPath())

	// if _, err := os.Stat(fullPathWithRoot); errors.Is(err, os.ErrNotExist) {
	//	return errors.New(fmt.Sprintf("File with path %s does not exist", fullPathWithRoot))
	//}

	_, err := os.Stat(fullPathWithRoot)

	return !errors.Is(err, os.ErrNotExist)
}

func (s *Store) Delete(key string) error {
	pathKey := s.PathTransformFunc(key)
	firstPathFolderWithRoot := fmt.Sprintf("%s/%s", s.RootPath, strings.Split(pathKey.PathName, "/")[0])

	defer func() {
		fmt.Printf("Deleted %s from disk", pathKey.FileName)
	}()

	return os.RemoveAll(firstPathFolderWithRoot)
}

func (s *Store) readStream(key string) (io.ReadCloser, error) {
	pathKey := s.PathTransformFunc(key)
	pathNameWithRoot := fmt.Sprintf("%s/%s", s.RootPath, pathKey.GetFullPath())
	return os.Open(pathNameWithRoot)
}

func (s *Store) writeStream(key string, r io.Reader) error {
	pathKey := s.PathTransformFunc(key)
	pathNameWithRoot := fmt.Sprintf("%s/%s", s.RootPath, pathKey.PathName)
	if err := os.MkdirAll(pathNameWithRoot, os.ModePerm); err != nil {
		return err
	}

	fileNameWithRoot := fmt.Sprintf("%s/%s", s.RootPath, pathKey.GetFullPath())
	f, err := os.Create(fileNameWithRoot)
	if err != nil {
		return err
	}

	n, err := io.Copy(f, r)
	if err != nil {
		return err
	}

	log.Printf("Written (%d) bytes to disk %s", n, pathKey.GetFullPath())

	return nil
}
