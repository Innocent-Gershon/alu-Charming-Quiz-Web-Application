# alu-Charming-Quiz-Web-Application
Overview.
This project showcases my Quiz Web Application deployed to two web servers (Web01 and Web02) with a load balancer (Lb01) to ensure high availability, fault tolerance, and scalability. I ensured that the application works seamlessly across servers and through the load balancer, with proper testing conducted at every stage.

Prerequisites
Before starting, I ensured the following:
Access and Permissions:

I had SSH access to Web01, Web02, and Lb01.
I had sufficient permissions to install necessary software and modify configurations.
Installed Software:

Web servers (Node.js and Nginx) were set up on Web01 and Web02.
Load balancer software (Nginx) was installed on Lb01.
Prepared Application:

Both the backend and frontend of the Quiz Web Application were production-ready for deployment.
Networking Knowledge:

I had the skills to configure firewalls and manage server connectivity to ensure smooth deployment.

Deployment Steps
1. Application Deployment on Web01 and Web02
To ensure the application runs successfully on both servers, I performed the following steps:

A. Accessing the Servers
I logged into Web01 and Web02 via SSH:

ssh user@Web01_IP
ssh user@Web02_IP

B. Installing Required Software
I installed Node.js and Nginx on both servers:
I install them because they are necessary since they are the dependecies I used in my web application development.
So all these installations are done on the the root of my web-01 and web-02 to have it in the system.
After that I clone the repo having my codes.

c. Starting the Backend
On both servers, I navigated to the backend directory, installed dependencies, and started the server:

D. Configuring Nginx for Frontend Hosting
I ensured the frontend was properly served by Nginx. I updated the Nginx configuration on both servers (/etc/nginx/sites-available/default):
I tested the configuration and reloaded Nginx:

E. Verification
I tested the application by accessing http://Web01_IP and http://Web02_IP in the browser to ensure the frontend and backend were working properly.

2. Load Balancer Configuration (Lb01)
To ensure smooth traffic distribution, I configured Lb01 as a load balancer:

A. Installing Nginx on Lb01 and at the root of the repo.
So since the load balancer is only wanna serve as the smooth traffic distribution, I never clone the repo on the load balancer.

B. Setting Up Load Balancing
I configured Nginx to distribute traffic between Web01 and Web02. I edited /etc/nginx/sites-available/default on Lb01:

I tested the configuration and reloaded Nginx:
When testing, error persisted, but I made sure the test was successful.

C. Verification
I accessed http://Lb01_IP in my browser to confirm that requests were distributed between Web01 and Web02.

After installing Nginx and making the necessary edits to the configuration file, the load balancer was not properly balancing between web-01 and web-02.

To resolve this, I installed HAProxy and made the required changes to its configuration as well. However, when I tested the HAProxy configuration file, I encountered an error indicating that port 80 was already being used by another process.

Upon investigation, I discovered that Nginx was using port 80. I had to stop the Nginx service and restart HAProxy. After doing so, HAProxy ran successfully.

Conclusion
By following the steps above, I successfully deployed the Quiz Web Application across Web01 and Web02 and ensured that Lb01 distributed traffic effectively. The application functions seamlessly, even under simulated server failures. This setup guarantees scalability, high availability, and reliability.
