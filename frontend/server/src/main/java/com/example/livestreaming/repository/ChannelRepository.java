package com.example.livestreaming.repository;

import com.example.livestreaming.entity.Channel;
import com.example.livestreaming.entity.User;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelRepository extends JpaRepository<Channel, Integer> {
    @Query("SELECT c FROM Channel c WHERE c.streamKey = ?1")
    Optional<Channel> findByStreamKey(String streamKey);

    //find channel by user_id
    @Query("SELECT c FROM Channel c WHERE c.user.id = ?1")
    Optional<Channel> findByUserId(Integer userId);

    @Query("SELECT c FROM Channel c WHERE c.channelName = ?1")
    Optional<Channel> findByChannelName(String channelName);

    @Override
    <S extends Channel> List<S> findAll(Example<S> example);

    //find all live channels
    @Query("SELECT c FROM Channel c WHERE c.isLiveStreaming = true")
    List<Channel> findAllLiveChannels();
}
