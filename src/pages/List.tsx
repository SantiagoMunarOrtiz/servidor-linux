import React, { useState, useEffect, useRef } from 'react';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
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
  const [quantity, setQuantity] = useState<number>(1); 
  const [customerType, setCustomerType] = useState<string>(''); 
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

  // Llamar a la API para obtener los productos de fakestoreapi ya que fakePlatzi no revise soporte esta fallando 
  // por lo tanto decidi cambiarlo yo me comunique con rescursos humanos y comente lo sucedido.
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const productsData = await response.json();
      console.log('Productos recibidos:', productsData); 
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener productos:', error); 
      showToast({ message: 'Error fetching products', duration: 2000, color: 'danger' });
      setLoading(false);
    }
  };

  
  const addToWishlist = (product: any) => {
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    showToast({ message: 'Added to wishlist', duration: 2000, color: 'success' });
  };

  // Remover producto de la lista de deseos
  const removeFromWishlist = (product: any) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    showToast({ message: 'Removed from wishlist', duration: 2000, color: 'warning' });
  };

  // Comprobar si un producto está en la lista de deseos
  const isInWishlist = (product: any) => {
    return wishlist.some((item) => item.id === product.id);
  };

  // Mostrar detalles del producto cuando se selecciona uno
  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
  };

  // Cerrar modal de detalles
  const closeProductDetails = () => {
    setSelectedProduct(null);
    setQuantity(1); 
    setCustomerType(''); 
  };

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={'success'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Product List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/wishlist')}>
              <IonIcon slot="icon-only" icon={heartOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar color={'success'}>
          <IonSearchbar />
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
                {product.image ? (
                  <IonAvatar slot="start">
                    <IonImg src={product.image} />
                  </IonAvatar>
                ) : (
                  <IonAvatar slot="start">
                    <IonImg src="/assets/default-image.png" /> 
                  </IonAvatar>
                )}
                <IonLabel>
                  {product.title}
                  <p>${product.price}</p>
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
                <IonTitle>Detalles del producto</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeProductDetails}>Cerrar</IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonItem>
                <IonLabel>
                  <h2>{selectedProduct.title}</h2>
                  <p>{selectedProduct.description}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Cantidad</IonLabel>
                <IonInput
                  type="number"
                  value={quantity}
                  placeholder="Ingrese la cantidad"
                  onIonChange={(e) => setQuantity(parseInt(e.detail.value!, 10))}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Tipo de Cliente</IonLabel>
                <IonSelect
                  value={customerType}
                  placeholder="Seleccione el tipo de cliente"
                  onIonChange={(e) => setCustomerType(e.detail.value)}
                >
                  <IonSelectOption value="regular">Regular</IonSelectOption>
                  <IonSelectOption value="vip">VIP</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonButton expand="block" color="primary" onClick={closeProductDetails}>
                Confirmar
              </IonButton>
            </IonContent>
          </IonModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default List;
