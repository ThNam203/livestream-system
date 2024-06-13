package com.example.livestreaming.entity;

import com.example.livestreaming.enums.TokenType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Builder
@Entity
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "channel")
@SequenceGenerator(name = "id_seq", sequenceName = "id_seq", allocationSize = 1)
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_seq")
    @Column(name = "id")
    private Integer id;

    @Column(nullable = false, unique = true)
    private String streamKey;
    private String channelName;
    private String title;
    private List<String> tags;
    private boolean isLiveStreaming;
    private boolean enableLLHLS;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
