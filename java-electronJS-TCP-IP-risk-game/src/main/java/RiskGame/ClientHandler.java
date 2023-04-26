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
        while (!this.client.isClosed()) {

            String receivedData = read();
            receivedData = receivedData.trim();
            JSONObject jsonObject = new JSONObject(receivedData);

            Consumer consumer = functions.get(jsonObject.getString("processType"));
            if (consumer != null) {
                consumer.accept(jsonObject);
            }
            functions.get("2").accept(jsonObject);
        }
    }

    public String read() {
        String output = null;
        String result = "";
        try {
            do {
                byte[] data = new byte[readBuffet];
                in.read(data);
                output = new String(data, StandardCharsets.US_ASCII).replaceAll("\u0000", "");
                System.out.println("received data == " + output);
                result = result.concat(output);
            } while (in.available() > 0);

        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    public void write(Object json) {
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", "John");
            String stringfiedJSON = jsonObject.toString();
            byte[] sentData = stringfiedJSON.getBytes();
            out.write(sentData);
            System.out.println("Message is sent");
        } catch (IOException ex) {
            Logger.getLogger(ClientHandler.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private void createSession(Object json) {
        System.out.println("Session Will be created");
        this.sessionId = Server.getSessionID();
        Server.getSessions().add(new Session(this.sessionId));
        Server.setSessionID(this.sessionId + 1);

        Server.getSessions().get(this.sessionId).setFirst_player(this);
    }
       
   private void sendSessions(){
       for (Session session : Server.getSessions()) {
           String sessionName = session.getFirst_player().getClient().getRemoteSocketAddress().toString();
       }
   }
    
    private void initFunctions() {
        this.functions = new HashMap<>();
        functions.put("1", this::createSession);
        functions.put("2", this::write);
        functions.put("3",this::sendSessions);
    }
    /*
    1: create a session
    2: send to client
    3: send sessions
    */

    /**
     * @return the client
     */
    public Socket getClient() {
        return client;
    }
}
