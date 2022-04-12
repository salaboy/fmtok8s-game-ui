package com.salaboy.conferences.game.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class SessionScore {
    @JsonProperty("SessionId")
    private String sessionId;
    @JsonProperty("AccumulatedScore")
    private String accumulatedScore;
    @JsonProperty("Nickname")
    private String nickname;
    @JsonProperty("Time")
    private Date gameTime;
    @JsonProperty("LastLevel")
    private String lastLevel;
    @JsonProperty("AccumulatedTimeInSeconds")
    private long accumulatedTimeInSeconds;

    public SessionScore() {
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getAccumulatedScore() {
        return accumulatedScore;
    }

    public void setAccumulatedScore(String accumulatedScore) {
        this.accumulatedScore = accumulatedScore;
    }

    public Date getGameTime() {
        return gameTime;
    }

    public void setGameTime(Date gameTime) {
        this.gameTime = gameTime;
    }

    public String getLastLevel() {
        return lastLevel;
    }

    public void setLastLevel(String lastLevel) {
        this.lastLevel = lastLevel;
    }

    public long getAccumulatedTimeInSeconds() {
        return accumulatedTimeInSeconds;
    }

    public void setAccumulatedTimeInSeconds(long accumulatedTimeInSeconds) {
        this.accumulatedTimeInSeconds = accumulatedTimeInSeconds;
    }

    @Override
    public String toString() {
        return "SessionScore{" +
                "sessionId='" + sessionId + '\'' +
                ", accumulatedScore='" + accumulatedScore + '\'' +
                ", nickname='" + nickname + '\'' +
                ", gameTime=" + gameTime +
                ", lastLevel='" + lastLevel + '\'' +
                ", accumulatedTimeInSeconds=" + accumulatedTimeInSeconds +
                '}';
    }
}