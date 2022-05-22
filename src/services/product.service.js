import api from "./api"
const BASE = '/purchase/';

class ProductService {
    addToReservation(purchaseUUID, item) {
        return api.post(BASE + 'add', {
            product_name: item.name,
            position: item.position,
            purchase_uuid: purchaseUUID,
        });
    }

    deleteFromReservation(purchaseUUID, item) {
        return api.post(BASE + 'delete', { // TODO
            product_name: item.name,
            position: item.position,
            purchase_uuid: purchaseUUID,
        });
    }

    showReservation(purchaseUUID) {
        return api.get(BASE + "show" + "?purchase_uuid=" + purchaseUUID)
    }

    confirmPurchase(purchaseUUID) {
        return api.post(BASE + 'confirm', {
            'purchase_uuid': purchaseUUID,
            'is_social_card': false,
        })
    }
}
export default new ProductService();