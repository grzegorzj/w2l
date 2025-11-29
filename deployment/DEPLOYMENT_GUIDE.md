# W2L Renderer API - Deployment Guide

This guide covers deploying the W2L Renderer API to various platforms.

## Prerequisites

Before deploying, ensure:

1. ✅ Parent w2l library is built (`npm run build` in parent directory)
2. ✅ Dependencies are installed (`npm install` in deployment directory)
3. ✅ Tests pass (`npm test` in deployment directory)

## Local Testing

### Standard Node.js

```bash
# Install dependencies
npm install

# Start server
npm start

# Or use development mode with auto-reload
npm run dev

# Test the service
npm test

# Test with cURL
curl http://localhost:3000/health
```

### Docker (Local)

```bash
# Build image from parent directory
cd ..
docker build -t w2l-renderer -f deployment/Dockerfile .

# Or use the build script
cd deployment
./build.sh

# Run container
docker run -p 3000:3000 w2l-renderer

# Test
curl http://localhost:3000/health
```

### Docker Compose

```bash
# Start service
docker-compose up -d

# View logs
docker-compose logs -f

# Stop service
docker-compose down
```

## Railway Deployment

Railway is the recommended platform for quick, production deployments.

### Step 1: Prerequisites

1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
3. Login:
   ```bash
   railway login
   ```

### Step 2: Build Parent Library

Before deploying, ensure the parent w2l library is built:

```bash
cd ..
npm run build
cd deployment
```

### Step 3: Initialize Railway Project

```bash
# Create new project
railway init

# Or link to existing project
railway link
```

### Step 4: Deploy

```bash
# Deploy using Dockerfile
railway up
```

Railway will:
- Detect the `railway.json` configuration
- Build using the Dockerfile
- Set up health checks
- Provide a public URL

### Step 5: Configure Environment

Set environment variables in Railway dashboard or via CLI:

```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
```

### Step 6: Add Custom Domain (Optional)

1. Go to Railway project dashboard
2. Click on your service
3. Navigate to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

### Railway Configuration Details

The `railway.json` file specifies:

```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Railway Tips

- **Build Context**: Railway builds from the repository root
- **File Structure**: Ensure `dist/` folder is included in the repository or build it during deployment
- **Logs**: View logs in Railway dashboard or via `railway logs`
- **Scaling**: Upgrade plan for auto-scaling and more resources
- **Monitoring**: Railway provides built-in metrics

## Docker Hub Deployment

For sharing the image or deploying to other platforms:

### Build and Push

```bash
# Build image
docker build -t your-username/w2l-renderer:latest -f deployment/Dockerfile ..

# Login to Docker Hub
docker login

# Push image
docker push your-username/w2l-renderer:latest
```

### Pull and Run

```bash
# On target server
docker pull your-username/w2l-renderer:latest
docker run -d -p 3000:3000 --name w2l-renderer your-username/w2l-renderer:latest
```

## AWS Elastic Container Service (ECS)

### Prerequisites

1. AWS CLI installed and configured
2. ECR repository created
3. ECS cluster set up

### Steps

1. **Build and push to ECR**:
   ```bash
   # Authenticate Docker to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
   
   # Build image
   docker build -t w2l-renderer -f deployment/Dockerfile ..
   
   # Tag image
   docker tag w2l-renderer:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/w2l-renderer:latest
   
   # Push to ECR
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/w2l-renderer:latest
   ```

2. **Create ECS Task Definition**:
   - Container image: Your ECR image URL
   - Port mappings: 3000:3000
   - Memory: 512 MB (minimum)
   - CPU: 256 (minimum)
   - Health check: `/health` endpoint

3. **Create ECS Service**:
   - Launch type: Fargate (recommended) or EC2
   - Desired tasks: 1 (or more for scaling)
   - Load balancer: Application Load Balancer (optional)

4. **Configure Load Balancer** (optional):
   - Target group: Port 3000
   - Health check: `/health`
   - SSL certificate for HTTPS

## Google Cloud Run

Cloud Run is excellent for serverless container deployments.

### Steps

1. **Build and push to GCR**:
   ```bash
   # Configure Docker for GCR
   gcloud auth configure-docker
   
   # Build image
   docker build -t gcr.io/YOUR_PROJECT/w2l-renderer -f deployment/Dockerfile ..
   
   # Push to GCR
   docker push gcr.io/YOUR_PROJECT/w2l-renderer
   ```

2. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy w2l-renderer \
     --image gcr.io/YOUR_PROJECT/w2l-renderer \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --memory 512Mi \
     --cpu 1 \
     --max-instances 10
   ```

3. **Configure domain** (optional):
   ```bash
   gcloud run domain-mappings create --service w2l-renderer --domain api.yourdomain.com
   ```

## Azure Container Instances

### Steps

1. **Build and push to ACR**:
   ```bash
   # Login to Azure
   az login
   
   # Login to ACR
   az acr login --name YOUR_REGISTRY
   
   # Build and push
   docker build -t YOUR_REGISTRY.azurecr.io/w2l-renderer -f deployment/Dockerfile ..
   docker push YOUR_REGISTRY.azurecr.io/w2l-renderer
   ```

2. **Deploy to ACI**:
   ```bash
   az container create \
     --resource-group YOUR_GROUP \
     --name w2l-renderer \
     --image YOUR_REGISTRY.azurecr.io/w2l-renderer \
     --cpu 1 \
     --memory 1 \
     --port 3000 \
     --dns-name-label w2l-renderer-api \
     --environment-variables NODE_ENV=production
   ```

## DigitalOcean App Platform

### Steps

1. **Push code to GitHub/GitLab**

2. **Create App in DO Dashboard**:
   - Connect repository
   - Select branch
   - Dockerfile: `deployment/Dockerfile`
   - HTTP port: 3000
   - Health check: `/health`

3. **Configure resources**:
   - Basic: 512 MB RAM, 0.5 vCPU ($5/month)
   - Professional: 1 GB RAM, 1 vCPU ($12/month)

4. **Deploy**: App Platform will auto-deploy on git push

## Heroku

### Steps

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create app**:
   ```bash
   heroku create w2l-renderer
   ```

3. **Deploy using Docker**:
   ```bash
   # Login to Heroku Container Registry
   heroku container:login
   
   # Build and push
   heroku container:push web --app w2l-renderer
   
   # Release
   heroku container:release web --app w2l-renderer
   ```

4. **Open app**:
   ```bash
   heroku open --app w2l-renderer
   ```

## VPS Deployment (Ubuntu/Debian)

For deploying to a virtual private server:

### Prerequisites

- Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- Domain name (optional)

### Steps

1. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Clone repository**:
   ```bash
   git clone YOUR_REPO
   cd w2l
   npm install
   npm run build
   ```

3. **Build Docker image**:
   ```bash
   cd deployment
   docker build -t w2l-renderer -f Dockerfile ..
   ```

4. **Run container**:
   ```bash
   docker run -d \
     --name w2l-renderer \
     --restart unless-stopped \
     -p 3000:3000 \
     w2l-renderer
   ```

5. **Set up Nginx reverse proxy** (optional):
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Set up SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

## Kubernetes

For advanced orchestration:

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: w2l-renderer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: w2l-renderer
  template:
    metadata:
      labels:
        app: w2l-renderer
    spec:
      containers:
      - name: w2l-renderer
        image: your-registry/w2l-renderer:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: w2l-renderer
spec:
  selector:
    app: w2l-renderer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

Apply with:
```bash
kubectl apply -f k8s-deployment.yaml
```

## Performance Tuning

### Scaling Considerations

- **Memory**: Minimum 512 MB, recommended 1 GB
- **CPU**: Minimum 0.5 vCPU, recommended 1 vCPU
- **Concurrency**: Handle ~100 requests/second per instance
- **Horizontal Scaling**: Add more instances for higher load

### Optimization Tips

1. **Enable caching**: Add Redis for rendered outputs
2. **CDN**: Use CloudFlare or similar for static SVGs
3. **Connection pooling**: Use PM2 for cluster mode
4. **Monitoring**: Set up application monitoring (New Relic, Datadog)
5. **Rate limiting**: Implement to prevent abuse

### PM2 Cluster Mode

```bash
# Install PM2
npm install -g pm2

# Start in cluster mode
pm2 start server.js -i max --name w2l-renderer

# Save process list
pm2 save

# Auto-start on boot
pm2 startup
```

## Monitoring & Logging

### Health Checks

The `/health` endpoint provides service status:

```bash
curl http://your-api/health
```

### Logging

- **Development**: Logs to console
- **Production**: Use log aggregation (CloudWatch, Stackdriver, Papertrail)

### Monitoring Services

- **Uptime monitoring**: UptimeRobot, Pingdom
- **APM**: New Relic, Datadog, AppDynamics
- **Error tracking**: Sentry, Rollbar

## Security

### Best Practices

1. **API Keys**: Implement authentication if needed
2. **Rate Limiting**: Use express-rate-limit
3. **CORS**: Configure allowed origins
4. **HTTPS**: Always use SSL in production
5. **Secrets**: Use environment variables, never commit secrets

### Rate Limiting Example

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/render', limiter);
```

## Troubleshooting

### Common Issues

**Issue**: Docker build fails
- **Solution**: Ensure building from parent directory with correct context

**Issue**: Health check fails
- **Solution**: Check port mapping and ensure server starts properly

**Issue**: High memory usage
- **Solution**: Increase container memory limits or optimize w2l code

**Issue**: Slow rendering
- **Solution**: Implement caching, increase CPU allocation

## Cost Estimates

| Platform | Basic Plan | Resources | Monthly Cost |
|----------|-----------|-----------|--------------|
| Railway | Hobby | 512 MB RAM | $5-10 |
| Heroku | Basic | 512 MB RAM | $7 |
| DigitalOcean | Basic | 512 MB RAM | $5 |
| AWS Fargate | 0.5 vCPU, 1 GB | Pay per use | ~$15 |
| GCP Cloud Run | Auto-scale | Pay per request | ~$5-20 |

## Support

For deployment issues:
1. Check logs for error messages
2. Verify w2l library is built
3. Test locally first
4. Check platform-specific documentation

## Next Steps

After deployment:
1. ✅ Test all endpoints
2. ✅ Set up monitoring
3. ✅ Configure custom domain
4. ✅ Implement rate limiting
5. ✅ Set up CI/CD pipeline

