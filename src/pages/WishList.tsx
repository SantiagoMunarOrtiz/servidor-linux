import React, { useEffect, useState } from 'react';
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const history = useHistory();

  
  useIonViewWillEnter(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  });

  // ----------------------Remover producto de la lista de deseos-------------------------------------------------------
  const removeFromWishlist = (product: any) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle>Wishlist</IonTitle>
          <IonButton slot="end" onClick={() => history.push('/list')}>
            Back to Products
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {wishlist.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>No products in wishlist</p>
        ) : (
          wishlist.map((product) => (
            <IonCard key={product.id}>
              <IonCardContent className="ion-no-padding">
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <IonImg src={product.image} />
                  </IonAvatar>
                  <IonLabel>
                    {product.title}
                    <p>${product.price}</p>
                  </IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    onClick={() => removeFromWishlist(product)}
                  >
                    <IonIcon icon={trashBinOutline} />
                  </IonButton>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Wishlist;
