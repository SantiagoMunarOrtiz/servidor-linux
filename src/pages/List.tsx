import React, { useState, useRef } from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import { addOutline, trashBinOutline, heartOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './List.css';

const List: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showToast] = useIonToast();
  const history = useHistory();
  const page = useRef(null);

  useIonViewWillEnter(async () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    await fetchProducts(); 
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dependenciesData = await response.json();
      console.log('Datos simulados recibidos:', dependenciesData);

      setProducts(dependenciesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast({ message: 'Error fetching data', duration: 2000, color: 'danger' });
      setLoading(false);
    }
  };

  const addToWishlist = (product: any) => {
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    showToast({ message: 'Added to bookmarks', duration: 2000, color: 'success' });
  };

  const removeFromWishlist = (product: any) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    showToast({ message: 'Removed from bookmarks', duration: 2000, color: 'warning' });
  };

  const isInWishlist = (product: any) => {
    return wishlist.some((item) => item.id === product.id);
  };

  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dependency Explorer</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/bookmarks')}>
              <IonIcon slot="icon-only" icon={heartOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar color={'primary'}>
          <IonSearchbar placeholder="Search dependencies..." />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed">
          <IonRefresherContent />
        </IonRefresher>

        {loading &&
          [...Array(10)].map((_, index) => (
            <IonCard key={index}>
              <IonCardContent className="ion-no-padding">
                <IonItem lines="none">
                  <IonSkeletonText />
                  <IonLabel>
                    <IonSkeletonText animated style={{ width: '150px' }} />
                  </IonLabel>
                  <IonChip slot="end" color={'primary'}></IonChip>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))}

        {products.map((product) => (
          <IonCard key={product.id} onClick={() => openProductDetails(product)}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonLabel>
                  {product.title}
                  <p>Dependency ID: {product.id}</p>
                </IonLabel>
                <IonButton
                  slot="end"
                  fill="clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    isInWishlist(product) ? removeFromWishlist(product) : addToWishlist(product);
                  }}
                >
                  <IonIcon icon={isInWishlist(product) ? trashBinOutline : addOutline} />
                </IonButton>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}

        {selectedProduct && (
          <IonModal isOpen={!!selectedProduct} onDidDismiss={closeProductDetails}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Dependency Details</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeProductDetails}>Close</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonItem>
                <IonLabel>
                  <h2>Dependency Name: {selectedProduct.title}</h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p><strong>Version:</strong> 1.0.{selectedProduct.id}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p><strong>Size:</strong> {Math.floor(Math.random() * 100) + 1} MB</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <p><strong>Description:</strong> {selectedProduct.body}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Installation Options</IonLabel>
                <IonSelect placeholder="Select option">
                  <IonSelectOption value="default">Default</IonSelectOption>
                  <IonSelectOption value="custom">Custom</IonSelectOption>
                  <IonSelectOption value="minimal">Minimal</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonButton expand="block" color="primary" onClick={closeProductDetails}>
                Install Dependency
              </IonButton>
            </IonContent>
          </IonModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default List;
