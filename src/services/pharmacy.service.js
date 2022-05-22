import api from "./api"
const BASE = '/pharmacy/';

class PharmacyService {
    create(pharmacy) {
        return api.post(BASE + 'create', {
            "name": pharmacy.name,
            "address": {
                "city": pharmacy.city,
                "street": pharmacy.street,
                "house": pharmacy.house,
            },
        })
    }

    getAllPharmacies() {
        return api.get(BASE + 'all');
    }

    getAvailableProducts() {
        return api.get(BASE + 'products')
    }
}
export default new PharmacyService();