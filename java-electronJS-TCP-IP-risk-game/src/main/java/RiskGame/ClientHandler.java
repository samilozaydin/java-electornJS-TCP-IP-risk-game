/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RiskGame;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author Bilal
 */
public class ClientHandler implements Runnable {

    private static int readBuffet = 4096;

    private int id;
    private int sessionId;

    private Socket client;
    private InputStream in;
    private OutputStream out;

    private boolean isSessionWait = true;

    private HashMap<String, Consumer> functions;

    public ClientHandler(Socket client, int id) throws IOException {
        this.client = client;
        this.in = this.client.getInputStream();
        this.out = this.client.getOutputStream();
        this.id = id;
        initFunctions();

    }

    @Override
    public void run() {
        System.out.println("CLIENT BAGLANDI");
        System.out.println(id);
        System.out.println(Server.getSessions());
        while (!this.client.isClosed() && isIsSessionWait()) {
            System.out.print("");
            String receivedData = read();
            if (receivedData.isEmpty()) {
                endConnection(null);
            }

            receivedData = receivedData.trim();
            JSONObject jsonObject = new JSONObject(receivedData);

            Consumer consumer = functions.get(jsonObject.getString("processType"));
            if (consumer != null) {
                consumer.accept(jsonObject);
            }
            //functions.get("2").accept(jsonObject);
        }
    }

    public String read() {
        String output = null;
        String result = "";
        try {
            do {
                byte[] data = new byte[readBuffet];
                getIn().read(data);
                output = new String(data, StandardCharsets.US_ASCII).replaceAll("\u0000", "");
                // System.out.println("received data == " + output);
                result = result.concat(output);
            } while (getIn().available() > 0);

        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    public void write(Object json) {
        try {
            JSONObject jsonObject = (JSONObject) json;
            //jsonObject.put("name", "John");
            String stringfiedJSON = jsonObject.toString();
            byte[] sentData = stringfiedJSON.getBytes();
            getOut().write(sentData);
            //System.out.println("Message is sent");
        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void createSession(Object json) {
        JSONObject jsonObject = (JSONObject) json;

        System.out.println("Session Will be created");

        this.sessionId = Server.getSessionID();
        Session newSession = new Session(this.sessionId);
        newSession.setSessionName(jsonObject.getString("sessionName"));
        Server.getSessions().add(newSession);
        Server.setSessionID(this.sessionId + 1);

        newSession.setFirst_player(this);
    }

    private void sendSessions(Object o) {
        JSONObject sessionsJSON = new JSONObject();
        for (Session session : Server.getSessions()) {
            JSONObject sessionJSON = new JSONObject();

            String sessionName = "";
            sessionName += session.getSessionName();
            System.out.println("session name " + sessionName);
            sessionJSON.put("sessionName", sessionName);

            if (session.getSecond_player() == null) {
                sessionJSON.put("sessionTotalPlayer", "1");
            } else {
                sessionJSON.put("sessionTotalPlayer", "2");
            }
            System.out.println("total player =" + sessionJSON.getString("sessionTotalPlayer"));

            sessionJSON.put("sessionId", "" + session.getId());

            sessionsJSON.put("session_" + session.getId(), sessionJSON);
            System.out.println("session itself = " + sessionsJSON.get("session_" + session.getId()));
        }
        sessionsJSON.put("processType", "3");
        System.out.println(sessionsJSON.toString());
        write(sessionsJSON);
    }

    private void addPlayerToSession(Object o) {
        JSONObject JSON = (JSONObject) o;
        String sessionId = JSON.getString("sessionId");
        JSONArray gamePawns = (JSONArray) JSON.get("gamePawns");
        JSONArray troopAmounts = (JSONArray) JSON.get("troopsAmounts");
        for (Session session : Server.getSessions()) {
            if (session.getId() == Integer.parseInt(sessionId)) {
                session.setSecond_player(this);
                session.setTroopAmounts(troopAmounts);
                session.setGamePawns(gamePawns);
                System.out.println("Game session is created");
                startGame(session);
                return;
            }
        }

    }

    private void startGame(Object o) {
        System.out.println("session is started");
        Session session = (Session) o;
        this.isSessionWait = false;
        session.run();

    }

    public void endConnection(Object o) {
        for (Session session : Server.getSessions()) {
            System.out.println("session is searched.");
            if (session.getFirst_player().equals(this) || session.getSecond_player().equals(this)) {
                Server.getSessions().remove(session);
                System.out.println("session deleted");
            }

        }
    }
    public void emptyCall(Object o) {

    }
    private void initFunctions() {
        this.functions = new HashMap<>();
        functions.put("1", this::createSession);
        functions.put("2", this::write);
        functions.put("3", this::sendSessions);
        functions.put("4", this::addPlayerToSession);
        functions.put("5", this::startGame);
        functions.put("6", this::endConnection);
        functions.put("9", this::emptyCall);

    }


    /*
    1: create a session
    2: send to client
    3: send sessions
    4: add player to session
    5: start game
     */
    /**
     * @return the client
     */
    public Socket getClient() {
        return client;
    }

    /**
     * @param isSessionWait the isSessionWait to set
     */
    public void setIsSessionWait(boolean isSessionWait) {
        this.isSessionWait = isSessionWait;
    }

    /**
     * @return the in
     */
    public InputStream getIn() {
        return in;
    }

    /**
     * @return the out
     */
    public OutputStream getOut() {
        return out;
    }

    /**
     * @return the isSessionWait
     */
    public boolean isIsSessionWait() {
        return isSessionWait;
    }
}
