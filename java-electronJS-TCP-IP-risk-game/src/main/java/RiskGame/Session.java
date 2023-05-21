/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RiskGame;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author Bilal
 */
public class Session implements Runnable {

    /**
     * @return the gamePawns
     */
    private static int readBuffet = 4096;

    private ClientHandler first_player;
    private ClientHandler second_player;

    private InputStream first_in;
    private OutputStream first_out;
    private InputStream second_in;
    private OutputStream second_out;

    private int id;
    private String sessionName;

    private JSONArray gamePawns;
    private JSONArray troopAmounts;

    private int playerTurn = 1;
    private int gameMode = 1;
    private String processType;

    public Session(int id) {
        this.id = id;
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

    /**
     * @return the sessionName
     */
    public String getSessionName() {
        return sessionName;
    }

    /**
     * @param sessionName the sessionName to set
     */
    public void setSessionName(String sessionName) {
        this.sessionName = sessionName;
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    public JSONArray getGamePawns() {
        return gamePawns;
    }

    /**
     * @param gamePawns the gamePawns to set
     */
    public void setGamePawns(JSONArray gamePawns) {
        this.gamePawns = gamePawns;
    }

    @Override
    public void run() {

        this.first_in = first_player.getIn();
        this.first_out = first_player.getOut();
        this.second_in = second_player.getIn();
        this.second_out = second_player.getOut();
        first_player.setIsSessionWait(false);
        second_player.setIsSessionWait(false);
        Socket firstPlayerClient = first_player.getClient();
        Socket secondPlayerClient = second_player.getClient();
        System.out.println("Program calisti");

        JSONObject send = new JSONObject();
        send.put("processType", "5");
        send.put("gamePawns", this.gamePawns);
        send.put("troopsAmounts", this.troopAmounts);
        send.put("player", 1);
        send.put("playerTurn", this.playerTurn);
        send.put("message", "the game will be started.");

        write(send, first_out);
        send.put("player", 2);
        write(send, second_out);

        while (!firstPlayerClient.isClosed() && !secondPlayerClient.isClosed()) {
            send = new JSONObject();
            this.processType = "8";
            if (winCheck()) {
                /*  if (this.playerTurn == 1) {
                    send.put("processType", "1");
                    write(send, first_out);

                } else {
                    send.put("processType", "1");
                    write(send, second_out);

                }*/
                System.out.println("");
                for (Session session : Server.getSessions()) {
                    System.out.println("session is searched.");
                    if (session.getFirst_player().equals(first_player) || session.getSecond_player().equals(first_player)) {
                        System.out.println("");
                        Server.getSessions().remove(session);
                        System.out.println("session deleted");
                        first_player.setIsSessionWait(true);
                        second_player.setIsSessionWait(true);
                        //second_player.run();
                        new Thread(this.first_player).start();
                        return;
                    }
                }

            }

            if (playerTurn == 1) {//red player

                //read red player info
                String receivedData = read(first_in);
                System.out.println("outputum =!" + receivedData);

                if (receivedData.isEmpty()) {
                    first_player.endConnection(null);
                }
                receivedData = receivedData.trim();
                JSONObject jsonObject = new JSONObject(receivedData);
                //process them and send to other client
                JSONArray gamePawns = (JSONArray) jsonObject.get("gamePawns");
                JSONArray troopAmounts = (JSONArray) jsonObject.get("troopsAmounts");
                int gameMode = jsonObject.getInt("gameMode");

                this.gameMode = gameMode;
                this.gamePawns = gamePawns;
                this.troopAmounts = troopAmounts;

                send.put("gamePawns", this.gamePawns);
                send.put("troopsAmounts", this.troopAmounts);
                if (this.gameMode == 4 && this.playerTurn == 1) {
                    this.playerTurn = 2;
                    this.gameMode = 1;
                    this.processType = "10";
                } else if (this.gameMode == 4 && this.playerTurn == 2) {
                    this.playerTurn = 1;
                    this.gameMode = 1;
                    this.processType = "10";
                }
                send.put("processType", this.processType);

                send.put("playerTurn", this.playerTurn);
                send.put("gameMode", this.gameMode);

                if (this.processType.equals("10")) {
                    write(send, first_out);
                }
                write(send, second_out);
            } else {//blue player
                //read blue player info
                String receivedData = read(second_in);
                System.out.println("outputum =!" + receivedData);
                if (receivedData.isEmpty()) {
                    first_player.endConnection(null);
                }
                receivedData = receivedData.trim();
                JSONObject jsonObject = new JSONObject(receivedData);

                //process them and send to other client
                JSONArray gamePawns = (JSONArray) jsonObject.get("gamePawns");
                JSONArray troopAmounts = (JSONArray) jsonObject.get("troopsAmounts");
                int gameMode = jsonObject.getInt("gameMode");

                this.gameMode = gameMode;
                this.gamePawns = gamePawns;
                this.troopAmounts = troopAmounts;

                send.put("processType", "8");
                send.put("gamePawns", this.gamePawns);
                send.put("troopsAmounts", this.troopAmounts);
                if (this.gameMode == 4 && this.playerTurn == 1) {
                    this.playerTurn = 2;
                    this.gameMode = 1;
                    this.processType = "10";

                } else if (this.gameMode == 4 && this.playerTurn == 2) {
                    this.playerTurn = 1;
                    this.gameMode = 1;
                    this.processType = "10";

                }
                send.put("processType", this.processType);

                send.put("playerTurn", this.playerTurn);
                send.put("gameMode", this.gameMode);
                if (this.processType.equals("10")) {
                    write(send, second_out);
                    System.out.println("GIIIIIIIIIIIIIIIIIIIIIIR");

                }
                write(send, first_out);
            }
        }

    }

    private boolean winCheck() {
        boolean isAllSame = true;

        int before = gamePawns.getInt(0);
        for (int i = 0; i < gamePawns.length(); i++) {
            if (before != gamePawns.getInt(i)) {

                isAllSame = false;
            }
        }
        return isAllSame;
    }

    public String read(InputStream stream) {
        String output = null;
        String result = "";
        try {
            do {
                byte[] data = new byte[readBuffet];
                System.out.println("gelindi");
                stream.read(data);
                System.out.println("gidildi" + " " + data);

                output = new String(data, StandardCharsets.US_ASCII).replaceAll("\u0000", "");
                System.out.println("received data == " + output);
                result = result.concat(output);
            } while (stream.available() > 0);

        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        System.out.println("geldi mi+++" + result);
        return result;
    }

    public void write(Object json, OutputStream stream) {
        try {
            JSONObject jsonObject = (JSONObject) json;
            //jsonObject.put("name", "John");
            String stringfiedJSON = jsonObject.toString();
            byte[] sentData = stringfiedJSON.getBytes();
            stream.write(sentData);
            System.out.println("Message is sent");
        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * @return the troopAmounts
     */
    public JSONArray getTroopAmounts() {
        return troopAmounts;
    }

    /**
     * @param troopAmounts the troopAmounts to set
     */
    public void setTroopAmounts(JSONArray troopAmounts) {
        this.troopAmounts = troopAmounts;
    }
}
