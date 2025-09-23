// // import User from '../models/User.js';
// // import bcrypt from 'bcryptjs';
// // import jwt from 'jsonwebtoken';

// // // ✅ Register controller
// // export const register = async (req, res) => {
// //   try {
// //     const { name, email, password, role } = req.body;

// //     const allowedRoles = ['customer', 'restaurant', 'admin', 'delivery'];
// //     if (!allowedRoles.includes(role)) {
// //       return res.status(400).json({ message: 'Invalid role' });
// //     }

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Email already registered' });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const user = new User({ name, email, password: hashedPassword, role });
// //     await user.save();

// //     res.status(201).json({ message: 'User registered successfully', user });
// //   } catch (err) {
// //     console.error('[AUTH ERROR] Register:', err.message);
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // // ✅ Login controller
// // export const login = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(401).json({ message: 'User not found' });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

// //     const token = jwt.sign(
// //       { id: user._id, email: user.email, role: user.role },
// //       process.env.JWT_SECRET,
// //       { expiresIn: process.env.JWT_EXPIRES_IN }
// //     );

// //     res.json({ message: 'Login successful', token, user });
// //   } catch (err) {
// //     console.error('[AUTH ERROR] Login:', err.message);
// //     res.status(401).json({ message: err.message });
// //   }
// // };

// // // ✅ Get all Delivery Drivers (For Delivery Service to fetch)
// // export const getAllDrivers = async (req, res) => {
// //   try {
// //     const drivers = await User.find({ role: 'delivery' });

// //     if (!drivers.length) {
// //       return res.status(404).json({ message: 'No delivery drivers found' });
// //     }

// //     res.status(200).json(drivers);
// //   } catch (err) {
// //     console.error('[AUTH ERROR] Get Drivers:', err.message);
// //     res.status(500).json({ message: 'Failed to fetch drivers' });
// //   }
// // };


// // src/controllers/authController.js
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { getOidcClient } from '../config/oidc.js';
// import * as openid from 'openid-client';
// const { generators } = openid;

// import { putState, getState } from '../utils/stateStore.js';

// // Helper to sign your first-party JWT
// function signAppToken(user) {
//   return jwt.sign(
//     {
//       sub: String(user._id),
//       id: String(user._id),
//       email: user.email,
//       role: user.role,
//       iss: process.env.JWT_ISSUER || 'auth-service',
//       aud: process.env.JWT_AUDIENCE || 'your-api',
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
//   );
// }

// /* =====================
//    Local Register/Login
//    ===================== */

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const allowedRoles = ['customer', 'restaurant', 'admin', 'delivery'];
//     if (!allowedRoles.includes(role)) {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword, role });
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully', user });
//   } catch (err) {
//     console.error('[AUTH ERROR] Register:', err.message);
//     res.status(400).json({ message: err.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) return res.status(401).json({ message: 'User not found' });

//     if (!user.password) {
//       return res.status(400).json({ message: 'This account uses OAuth sign-in' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//     const token = signAppToken(user);
//     res.json({ message: 'Login successful', token, user });
//   } catch (err) {
//     console.error('[AUTH ERROR] Login:', err.message);
//     res.status(401).json({ message: err.message });
//   }
// };

// export const getAllDrivers = async (req, res) => {
//   try {
//     const drivers = await User.find({ role: 'delivery' });
//     if (!drivers.length) {
//       return res.status(404).json({ message: 'No delivery drivers found' });
//     }
//     res.status(200).json(drivers);
//   } catch (err) {
//     console.error('[AUTH ERROR] Get Drivers:', err.message);
//     res.status(500).json({ message: 'Failed to fetch drivers' });
//   }
// };

// /* =====================
//    OIDC: Authorization Code + PKCE
//    ===================== */

// // GET /auth/oauth/login/:provider
// export const oauthLogin = async (req, res) => {
//   try {
//     const { provider } = req.params;

//     const issuerUrl =
//       provider === 'google'
//         ? process.env.OIDC_ISSUER || 'https://accounts.google.com'
//         : process.env.OIDC_ISSUER;

//     const client = await getOidcClient({
//       issuerUrl,
//       client_id: process.env.OIDC_CLIENT_ID,
//       client_secret: process.env.OIDC_CLIENT_SECRET,
//       redirect_uris: [process.env.OIDC_REDIRECT_URI],
//     });

//     const code_verifier = generators.codeVerifier();
//     const code_challenge = generators.codeChallenge(code_verifier);
//     const state = generators.state();
//     const nonce = generators.nonce();

//     putState(state, {
//       provider,
//       issuerUrl,
//       code_verifier,
//       nonce,
//       createdAt: Date.now(),
//     });

//     const authorizationUrl = client.authorizationUrl({
//       scope: process.env.OIDC_SCOPES || 'openid email profile',
//       response_type: 'code',
//       code_challenge,
//       code_challenge_method: 'S256',
//       state,
//       nonce,
//     });

//     return res.redirect(authorizationUrl);
//   } catch (err) {
//     console.error('[AUTH ERROR] oauthLogin:', err);
//     return res.status(500).json({ message: 'Failed to initiate OAuth login' });
//   }
// };

// // GET /auth/oauth/callback/:provider
// export const oauthCallback = async (req, res) => {
//   try {
//     const { provider } = req.params;
//     const { state, code } = req.query;

//     if (!state || !code) {
//       return res.status(400).json({ message: 'Missing state or code' });
//     }

//     const tx = getState(state);
//     if (!tx) {
//       return res.status(400).json({ message: 'Invalid or expired state' });
//     }

//     const { issuerUrl, code_verifier, nonce } = tx;

//     const client = await getOidcClient({
//       issuerUrl,
//       client_id: process.env.OIDC_CLIENT_ID,
//       client_secret: process.env.OIDC_CLIENT_SECRET,
//       redirect_uris: [process.env.OIDC_REDIRECT_URI],
//     });

//     const params = client.callbackParams(req);
//     const tokenSet = await client.callback(process.env.OIDC_REDIRECT_URI, params, {
//       code_verifier,
//       state,
//       nonce,
//     });

//     const claims = tokenSet.claims();
//     const sub = claims.sub;
//     const email = claims.email;
//     const emailVerified = !!claims.email_verified;
//     const picture = claims.picture;
//     const name = claims.name || email || 'User';

//     let user = await User.findOne({
//       identities: { $elemMatch: { provider, providerId: sub } },
//     });

//     if (!user) {
//       if (email && emailVerified) {
//         user = await User.findOne({ email });
//       }

//       if (user) {
//         user.identities.push({
//           provider,
//           providerId: sub,
//           email,
//           emailVerified,
//           picture,
//           lastLoginAt: new Date(),
//         });
//         if (!user.name && name) user.name = name;
//         await user.save();
//       } else {
//         user = new User({
//           name,
//           email: email || `no-email+${provider}:${sub}@example.local`,
//           role: 'customer', // default role
//           identities: [
//             {
//               provider,
//               providerId: sub,
//               email,
//               emailVerified,
//               picture,
//               lastLoginAt: new Date(),
//             },
//           ],
//         });
//         await user.save();
//       }
//     } else {
//       const idRef = user.identities.find(
//         (i) => i.provider === provider && i.providerId === sub
//       );
//       if (idRef) idRef.lastLoginAt = new Date();
//       await user.save();
//     }

//     const token = signAppToken(user);

//     // ✅ Fix: Redirect back to frontend callback page with token & user
//     return res.redirect(
//       `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&user=${encodeURIComponent(
//         JSON.stringify({
//           id: user._id,
//           email: user.email,
//           role: user.role,
//           name: user.name,
//         })
//       )}`
//     );
//   } catch (err) {
//     console.error('[AUTH ERROR] oauthCallback:', err);
//     return res.status(500).json({ message: 'OAuth callback failed' });
//   }
// };

// backend/auth_service/controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getOidcClient } from '../config/oidc.js';
import * as openid from 'openid-client';
const { generators } = openid;

import { putState, getState } from '../utils/stateStore.js';

/**
 * ======================
 * Helper: Sign your first-party JWT
 * ======================
 */
function signAppToken(user) {
  return jwt.sign(
    {
      sub: String(user._id),
      id: String(user._id),
      email: user.email,
      role: user.role,
      iss: process.env.JWT_ISSUER || 'auth-service',
      aud: process.env.JWT_AUDIENCE || 'your-api',
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

/**
 * ======================
 * Register (Password)
 * ======================
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ['customer', 'restaurant', 'admin', 'delivery'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('[AUTH ERROR] Register:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * ======================
 * Login (Password)
 * ======================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    if (!user.password) {
      return res.status(400).json({ message: 'This account uses OAuth sign-in' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signAppToken(user);
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('[AUTH ERROR] Login:', err.message);
    res.status(401).json({ message: err.message });
  }
};

/**
 * ======================
 * Get all delivery drivers
 * ======================
 */
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'delivery' });
    if (!drivers.length) {
      return res.status(404).json({ message: 'No delivery drivers found' });
    }
    res.status(200).json(drivers);
  } catch (err) {
    console.error('[AUTH ERROR] Get Drivers:', err.message);
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
};

/**
 * ======================
 * OIDC: Authorization Code + PKCE
 * ======================
 */

// GET /oauth/login/:provider
export const oauthLogin = async (req, res) => {
  try {
    const { provider } = req.params;
    console.log(`[OAUTH] Login request for provider: ${provider}`);

    const issuerUrl =
      provider === 'google'
        ? process.env.OIDC_ISSUER || 'https://accounts.google.com'
        : process.env.OIDC_ISSUER;

    console.log('[OAUTH] Using issuer URL:', issuerUrl);

    const client = await getOidcClient({
      issuerUrl,
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      redirect_uris: [process.env.OIDC_REDIRECT_URI],
    });

    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const state = generators.state();
    const nonce = generators.nonce();

    // store tx (replace with Redis in prod)
    putState(state, {
      provider,
      issuerUrl,
      code_verifier,
      nonce,
      createdAt: Date.now(),
    });

    const authorizationUrl = client.authorizationUrl({
      scope: process.env.OIDC_SCOPES || 'openid email profile',
      response_type: 'code',
      code_challenge,
      code_challenge_method: 'S256',
      state,
      nonce,
    });

    console.log('[OAUTH] Redirecting to:', authorizationUrl);
    return res.redirect(authorizationUrl);
  } catch (err) {
    console.error('[AUTH ERROR] oauthLogin:', err.message, err.stack);
    return res.status(500).json({
      message: 'Failed to initiate OAuth login',
      error: err.message,
    });
  }
};

// GET /oauth/callback/:provider
export const oauthCallback = async (req, res) => {
  try {
    const { provider } = req.params;
    const { state, code } = req.query;

    console.log(`[OAUTH] Callback from ${provider}, state=${state}, code=${code ? 'present' : 'missing'}`);

    if (!state || !code) {
      return res.status(400).json({ message: 'Missing state or code' });
    }

    const tx = getState(state);
    if (!tx) {
      return res.status(400).json({ message: 'Invalid or expired state' });
    }

    const { issuerUrl, code_verifier, nonce } = tx;
    console.log('[OAUTH] Retrieved stored transaction for state', state);

    const client = await getOidcClient({
      issuerUrl,
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      redirect_uris: [process.env.OIDC_REDIRECT_URI],
    });

    const params = client.callbackParams(req);
    console.log('[OAUTH] Callback params parsed:', params);

    const tokenSet = await client.callback(process.env.OIDC_REDIRECT_URI, params, {
      code_verifier,
      state,
      nonce,
    });

    console.log('[OAUTH] TokenSet received:', tokenSet);

    const claims = tokenSet.claims();
    console.log('[OAUTH] Claims:', claims);

    const sub = claims.sub;
    const email = claims.email;
    const emailVerified = !!claims.email_verified;
    const picture = claims.picture;
    const name = claims.name || email || 'User';

    // Find or create user
    let user = await User.findOne({
      identities: { $elemMatch: { provider, providerId: sub } },
    });

    if (!user) {
      if (email && emailVerified) {
        user = await User.findOne({ email });
      }

      if (user) {
        console.log('[OAUTH] Linking new identity to existing user', user.email);
        user.identities.push({
          provider,
          providerId: sub,
          email,
          emailVerified,
          picture,
          lastLoginAt: new Date(),
        });
        if (!user.name && name) user.name = name;
        await user.save();
      } else {
        console.log('[OAUTH] Creating new OAuth user for', email);
        user = new User({
          name,
          email: email || `no-email+${provider}:${sub}@example.local`,
          role: 'customer',
          identities: [
            {
              provider,
              providerId: sub,
              email,
              emailVerified,
              picture,
              lastLoginAt: new Date(),
            },
          ],
        });
        await user.save();
      }
    } else {
      console.log('[OAUTH] Existing user found, updating login time');
      const idRef = user.identities.find(
        (i) => i.provider === provider && i.providerId === sub
      );
      if (idRef) idRef.lastLoginAt = new Date();
      await user.save();
    }

    const token = signAppToken(user);

    console.log('[OAUTH] Issued app token for user', user.email);

    return res.json({
      message: 'OAuth login successful',
      token,
      user,
    });
  } catch (err) {
    console.error('[AUTH ERROR] oauthCallback:', err.message, err.stack);
    return res.status(500).json({ message: 'OAuth callback failed', error: err.message });
  }
};
