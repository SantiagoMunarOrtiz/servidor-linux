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
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './List.css';
import { heartOutline } from 'ionicons/icons';

const Tab1: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);
  const [showToast] = useIonToast();
  const history = useHistory();
  const page = useRef(null);

  
  useIonViewWillEnter(async () => {
    await fetchUsers();
  });

  
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://api.escuelajs.co/api/v1/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const usersData = await response.json();
      console.log('Usuarios recibidos:', usersData);
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener usuarios:', error); 
      showToast({ message: 'Error fetching users', duration: 2000, color: 'danger' });
      setLoading(false);
    }
  };

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={'success'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Admin y usuarios del sistema</IonTitle>
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

     
        {users.map((user) => (
          <IonCard key={user.id}>
            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
            
                {user.avatar ? (
                  <IonAvatar slot="start">
                    <IonImg src={user.avatar} />
                  </IonAvatar>
                ) : (
                  <IonAvatar slot="start">
                    <IonImg src="/assets/default-image.png" /> 
                  </IonAvatar>
                )}
                <IonLabel>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
              
                  <p><strong>Role:</strong> {user.role}</p>

                  
                  {user.role === 'empleado' && (
                    <IonChip color="success">
                      <IonIcon icon={heartOutline} />
                      <IonLabel>Empleado</IonLabel>
                    </IonChip>
                  )}

                  {/* ventas */}
                  {user.sales && user.sales.length > 0 ? (
                    <p>
                      <strong>Usuarios Eliminados</strong> {user.sales.length}
                      {/*detalless */}
                      <ul>
                        {user.sales.map((sale: any, index: number) => (
                          <li key={index}>Venta #{index + 1}: {sale.productName} (${sale.price})</li>
                        ))}
                      </ul>
                    </p>
                  ) : (
                    <p>Usuarios</p>
                  )}
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
