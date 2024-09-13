import React from 'react';
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonChip,
  IonItem,
  IonLabel,
  IonImg,
  IonIcon,
} from '@ionic/react';
import { heartOutline, heartSharp } from 'ionicons/icons';

interface ProductoCardProps {
  product: any;
  onToggleWishList: (product: any) => void;
  isWished: boolean;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ product, onToggleWishList, isWished }) => {
  return (
    <IonCard>
      <IonCardContent className="ion-no-padding">
        <IonItem lines="none">
          <IonAvatar slot="start">
            <IonImg
              src={
                product.image && product.image.length > 0
                  ? product.image
                  : 'https://via.placeholder.com/150'
              }
            />
          </IonAvatar>
          <IonLabel>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
            <p>{product.description}</p> {/* Mostrar descripción y abajo disponibles en la linea 38 */}
            <p>Unidades disponibles: {product.units}</p> 
          </IonLabel>
          <IonChip slot="end" color={'secondary'}>
            {product.category || 'No category'}
          </IonChip>
          <IonIcon
            slot="end"
            icon={isWished ? heartSharp : heartOutline}
            onClick={() => onToggleWishList(product)}
            color={isWished ? 'danger' : 'medium'}
            style={{ cursor: 'pointer' }}
          />
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductoCard;
