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
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Bilal
 */
public class Client {

    int port;
    Socket clientSocket;
    InputStream in;
    OutputStream out;
    public static int counter = 0;

    public Client(int port) throws IOException {
        this.port = port;
        clientSocket = new Socket("localhost", this.port);
        this.in = clientSocket.getInputStream();
        this.out = clientSocket.getOutputStream();
    }

    public void executeClient() {
        try {
            while (!clientSocket.isClosed()) {
                //  byte[] bytes = " blabla".getBytes();
                //  out.write(bytes);
                int byteSize = in.read();
                byte[] bytes = new byte[byteSize];
                this.in.read(bytes);
                System.out.println(new String(bytes, StandardCharsets.UTF_8));
                System.out.print(" " + counter + " " + clientSocket.getInetAddress() + " " + clientSocket.getPort());
                sleep(3000);
            }
        } catch (IOException ex) {
            Logger.getLogger(Client.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InterruptedException ex) {
            Logger.getLogger(Client.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                in.close();
                out.close();
            } catch (IOException ex) {
                Logger.getLogger(Client.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
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
        System.out.print(" " + counter + " " + clientSocket.getInetAddress() + " " + clientSocket.getPort());
        counter++;
        return bytes;
    }
}
