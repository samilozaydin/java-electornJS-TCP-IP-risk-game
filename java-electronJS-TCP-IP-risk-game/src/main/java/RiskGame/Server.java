/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package RiskGame;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import static java.lang.Thread.sleep;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Bilal
 */
public class Server {

    private ServerSocket serverSocket;
    private int port;
    private InputStream in;
    private OutputStream out;
    private int clientID;
    private static int sessionID;
    private static ArrayList<Session> sessions;
    
    public Server(int port) throws IOException {
        this.port = port;
        this.serverSocket = new ServerSocket(port);
        sessions = new ArrayList<>();
        clientID=0;
        sessionID=0;
    }

    public void execute() {

        new Thread(() -> {
            InputStream in = null;
            OutputStream out = null;
            try {

                while (!this.serverSocket.isClosed()) {
                    System.out.println("Server waiting for client...");
                    Socket clientSocket = serverSocket.accept();
                    System.out.println("Client "+clientSocket.getRemoteSocketAddress()+" has come to server and is connected");
                    System.out.println("----------------------------------------");
                    
                    new Thread(new ClientHandler(clientSocket, clientID)).start();
                    clientID++;
                    
//                    in = clientSocket.getInputStream();
//                    out = clientSocket.getOutputStream();
//
//                    byte[] writeByte = " bu yazildi".getBytes();
//                    out.write(writeByte);
//                    System.out.println("Beklemedi belki");
//                    sleep(3000);
//                    int byteSize = in.read();
//                    byte[] bytes = new byte[byteSize];
//                    in.read(bytes);
//                    System.out.println("Beklemedi");
//                    System.out.println(new String(bytes, StandardCharsets.UTF_8));
//                     
//                    byteSize = in.read();
//                    bytes = new byte[byteSize];
//                    in.read(bytes);
//                    System.out.println("Beklemedi2");
//                    System.out.println(new String(bytes, StandardCharsets.UTF_8));
                }

            } catch (IOException ex) {
                Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
            }/* catch (InterruptedException ex) {
                Logger.getLogger(Server.class.getName()).log(Level.SEVERE, null, ex);
            }*/
        }).start();
    }

    public byte[] sendData(Object receivedData) throws IOException {
        byte[] writeByte = " bu yazildi".getBytes();
        out.write(writeByte);
        return writeByte;
    }

    public byte[] receiveData(Object receivedData) throws IOException {
        int byteSize = in.read();
        byte[] bytes = new byte[byteSize];
        this.in.read(bytes);
        System.out.println(new String(bytes, StandardCharsets.UTF_8));

        return bytes;
    }
    
    public static ArrayList<Session> getSessions(){
        return sessions;
    }
    public static int getSessionID(){
        return sessionID;
    }
    public static void setSessionID(int sessionID){
        Server.sessionID= sessionID ;
    }
}
