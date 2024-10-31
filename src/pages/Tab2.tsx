import { Camera, CameraResultType } from '@capacitor/camera';
import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonMenuButton, IonPage, IonTitle, IonToolbar, IonTextarea } from '@ionic/react';
import React, { useState } from 'react';

const AddProduct: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const img = `data:image/jpeg;base64,${image.base64String}`;
    setImage(img);
  };

  const addProduct = () => {
    const product = {
      name: productName,
      description: productDescription,
      price: productPrice,
      image: image,
    };

    // Aquí podrías enviar el producto a una API o guardarlo en localStorage, etc.
    console.log('Producto agregado:', product);

    // Limpiar el formulario después de agregar el producto
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setImage(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'success'}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Buscar en terminal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/*---------------------- Formulario para capturar detalles del producto----------------------------------------------------- */}
        <IonItem>
          <IonLabel position="stacked">Nombre de la gestion</IonLabel>
          <IonInput
            value={productName}
            placeholder="Enter product name"
            onIonChange={(e) => setProductName(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Carpeta segura</IonLabel>
          <IonTextarea
            value={productDescription}
            placeholder="Enter product description"
            onIonChange={(e) => setProductDescription(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Crear codigo</IonLabel>
          <IonInput
            value={productPrice}
            type="number"
            placeholder="Enter product price"
            onIonChange={(e) => setProductPrice(e.detail.value!)}
          />
        </IonItem>

        {/*------------------Botón para tomar una foto ----------------------------------*/}
        <IonButton expand="full" onClick={takePicture}>
          Verificar si Eres tu
        </IonButton>

        {/*------------------------------ Mostrar la imagen capturada--------------------------*/}
        {image && <img src={image} alt="Product" style={{ marginTop: '20px', width: '100%' }} />}

        {/* botxn*/}
        <IonButton expand="full" color="success" onClick={addProduct} style={{ marginTop: '20px' }}>
          buscar informacion
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddProduct;
