package com.example.livestreaming.entity;

import com.example.livestreaming.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "user")
@SequenceGenerator(name = "id_seq", sequenceName = "id_seq", allocationSize = 1)
@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_seq")
    private Integer id;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(columnDefinition = "LONGTEXT")
    private String bio;
    private String birth;
    @Column(nullable = false, unique = true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany (mappedBy = "user", fetch = FetchType.EAGER)
    private List<Token> token;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "channel_id", referencedColumnName = "id")
    private Channel channel;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", birth='" + birth + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }
}
