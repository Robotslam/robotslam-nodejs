# RobotSlam Server

This is the RobotSlam Server, written in Node.JS using ECMAScript 2017.

## Requirements
* Node v7.6
* Postgres v9.5 (with PostGIS)

## Development

During development it is recommended to use
[nodemon](https://github.com/remy/nodemon) since it automatically
restart the application when it detects a file change.

But it's also possible to run it using `npm start`.

The application uses the `ROS_MASTER_URI` environment variable to decide
on which host it should attempt to connect to.

## Production
Prior to deploying, the clientside JavaScript has to be built
```bash
npm run client:build
```

The production environment is an EC2 server, which can be accessed on
https://robotslam.thinxmate.com.

The server can then be started in production mode using:
```bash
NODE_ENV=production npm start
```

## Configuring Server

For best compatibility with this guide, ensure the server is running
Ubuntu 16.04 LTS. It should be fairly trivial to port to newer versions.

### Installing VPN
In order to ensure bi-directional communication between the Robot and
RobotSlam server they need to be on the same local network. This is
easily achieved by setting up a OpenVPN instance.

Installing and configuring OpenVPN is easily achived using
https://github.com/Nyr/openvpn-install.

```bash
wget https://git.io/vpn -O openvpn-install.sh && bash openvpn-install.sh
```

*Remember to check that the ports used by OpenVPN are open (Security Groups in EC2 settings).*

### Installing nginx as reverse proxy

```bash
sudo npm install nginx
```

#### Installing SSL certificate from Lets Encrypt

Follow the instructions at https://certbot.eff.org/#ubuntuxenial-nginx

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

#### Adding configuration to nginx

Create the file `/etc/nginx/sites-available/robotslam` with the following content.
```
server {
    listen 80;
    server_name robotslam.thinxmate.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name robot.thinxmate.com;

    client_max_body_size 10G;

    location / {
        # Basic authentication
        auth_basic "Restricted Content";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://localhost:3000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }

    ssl on;
    ssl_certificate /etc/letsencrypt/live/robotslam.thinxmate.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/robotslam.thinxmate.com/privkey.pem;
    ssl_prefer_server_ciphers On;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;
}
```

Enable the new site using `sudo ln -s /etc/nginx/sites-available/robotslam /etc/nginx/sites-enabled/`
and restart nginx `sudo systemctl restart nginx`.

### Installing NVM
In order to ensure we install the correct Node version, we use the
Node Version Manager, https://github.com/creationix/nvm.

```bash
nvm install 7.*
nvm alias default 7.*
```

### Configuring Systemd (Node.js)

Create the file `/lib/systemd/system/robotslam.service` with the following content,
making sure to replace "<APPLICATION_FOLDER>" with the application path.

```systemd
[Unit]
Description=Robotslam Node.js application
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=ubuntu
WorkingDirectory=<APPLICATION FOLDER>
ExecStart=<APPLICATION FOLDER>/start.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Manual Deploy

Upload the new version of the project to the server to the `APPLICATION FOLDER`.
Then run the following commands in the `APPLICATION FOLDER`.

```bash
# Install the npm dependencies
$ npm install

# Compile the clientside JavaScript
$ npm run client:build

# Restart the service
sudo systemctl restart robotslam
```
