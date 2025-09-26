import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    return db && db._delegate && db._delegate._databaseId;
  } catch (error) {
    return false;
  }
};

const PRODUCTS_COLLECTION = 'products';

// Get all products
export const getProducts = async () => {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase not configured');
  }
  
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsRef, {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Add multiple products
export const addProducts = async (products) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const batch = [];
    
    products.forEach(product => {
      batch.push({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    const promises = batch.map(product => addDoc(productsRef, product));
    const docRefs = await Promise.all(promises);
    
    return docRefs.map(doc => doc.id);
  } catch (error) {
    console.error('Error adding products:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Delete all products
export const deleteAllProducts = async () => {
  try {
    const products = await getProducts();
    const deletePromises = products.map(product => deleteProduct(product.id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting all products:', error);
    throw error;
  }
};

// Subscribe to real-time updates
export const subscribeToProducts = (callback) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping real-time subscription');
    return () => {}; // Return empty unsubscribe function
  }
  
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(products);
    }, (error) => {
      console.error('Error in real-time subscription:', error);
    });
  } catch (error) {
    console.error('Error setting up real-time subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};
