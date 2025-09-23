import helmet from 'helmet';

export function configureHelmet(app) {
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:"],
          connectSrc: isDev
            ? ["'self'", "http://localhost:5004", "http://localhost:5010", "ws:"]
            : ["'self'", "https://your-api-domain.com"],
        },
      },
      crossOriginEmbedderPolicy: false, // needed in dev with React
    })
  );

  // Other protections
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
  app.use(helmet.frameguard({ action: 'deny' }));
  app.use(helmet.noSniff());
}
