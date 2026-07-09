import {cert, initializeApp, type ServiceAccount} from 'firebase-admin/app'
import {getFirestore } from 'firebase-admin/firestore'
import {env} from './env'

// Read file Service Account JSON
const serviceAccount = await Bun.file(env.FIREBASE_SERVICE_ACCOUNT_PATH).json() as ServiceAccount

// Init Firebase Admin App
const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
})

// Get Firestore instance
const db = getFirestore(firebaseApp)

console.log(`Successfully initialize firebase admin sdk with service account`)

export {firebaseApp, db}
