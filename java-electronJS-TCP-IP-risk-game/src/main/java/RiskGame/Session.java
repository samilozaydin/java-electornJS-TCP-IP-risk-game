/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RiskGame;

import java.net.Socket;

/**
 *
 * @author Bilal
 */
public class Session {
 
    private ClientHandler first_player;
    private ClientHandler second_player;
    private int id;
    
    public Session(int id){
        this.id =id;
    }


    public ClientHandler getFirst_player() {
        return first_player;
    }
    public void setFirst_player(ClientHandler first_player) {
        this.first_player = first_player;
    }
    public ClientHandler getSecond_player() {
        return second_player;
    }
    public void setSecond_player(ClientHandler second_player) {
        this.second_player = second_player;
    }
}
