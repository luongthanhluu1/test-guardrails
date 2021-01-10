import ky from 'ky-universal';

// export const apiServer = 'https://api.itaphoa.com';
export const apiServer = "https://123.aonhub.com";

let api = ky.create({
  prefixUrl: apiServer,
  timeout: 15000,
  retry: 0
});

export const handleLogin = token => {
  api = api.extend({
    headers: {
      authorization: token
    }
  });
};

export const fetchPartner = id => {
  return api.get(`admin/partners/${id}`).json();
};

export const getPartners = () => {
  return api.get('admin/partners').json();
};

export const addPartner = partner => {
  return api.post('admin/partners', { json: partner }).text();
};

export const updatePartner = (id, partner) => {
  return api.put(`admin/partners/${id}`, { json: partner });
};

export const deletePartner = id => {
  return api.delete(`admin/partners/${id}`);
};

export const getProducts = () => {
  return api.get('admin/products').json();
};

export const addProduct = product => {
  return api.post('admin/products', { json: product }).text();
};

export const updateProduct = (id, product) => {
  return api.put(`admin/products/${id}`, { json: product });
};

export const deleteProduct = id => {
  return api.delete(`admin/products/${id}`);
};

// categories

export const getCategories = () => {
  return api.get('admin/categories').json();
};

export const updateProductCategories = (id, categories) => {
  return api.put(`admin/productsCategories/${id}`, { json: categories });
};

//

export const getOrders = () => {
  return api.get('admin/orders').json();
};

export const updateOrder = (id, order) => {
  return api.put(`admin/orders/${id}`, { json: order });
};

export const getCustomerOrders = () => {
  return api.get('admin/customer-orders').json();
};

export const getChatPartners = () => {
  return api.get('admin/chat/partners').json();
};

export const getChatCustomers = partner => {
  return api.get(`admin/chat/customers?partner=${partner}`).json();
};

export const getChatMessages = (partner, customer) => {
  return api
    .get(`admin/chat/messages?partner=${partner}&customer=${customer}`)
    .json();
};

export const getChatChannel = partner => {
  return api.get(`admin/chat/channel?partner=${partner}`).json();
};

export const getCommunities = () => {
  return api.get('admin/communities').json();
};

export const addCommunity = community => {
  return api.post('admin/communities', { json: community }).text();
};

export const updateCommunity = (id, community) => {
  return api.put(`admin/communities/${id}`, { json: community });
};

export const deleteCommunity = id => {
  return api.delete(`admin/communities/${id}`);
};

export const getVouchers = () => {
  return api.get('admin/vouchers').json();
};

export const getVoucherPartners = () => {
  return api.get('admin/voucher_partner').json();
};

export const addVoucher = voucher => {
  return api.post('admin/vouchers', { json: voucher }).json();
};

export const addPartnerVoucher = (voucherData) => {
  return api
    .post('admin/voucher_partner', { json: voucherData })
    .json();
};

export const updateVoucher = (id, voucher) => {
  return api.put(`admin/vouchers/${id}`, { json: voucher }).json();
};

export const getPosts = () => {
  return api.get('admin/posts').json();
};

export const addPost = post => {
  return api.post('admin/posts', { json: post }).json();
};

export const updatePost = (id, post) => {
  return api.put(`admin/posts/${id}`, { json: post }).json();
};

export const deletePost = id => {
  return api.delete(`admin/posts/${id}`);
};

export const getData = path => {
  return api.get('admin/' + path).json();
};

export const addData = (path, data) => {
  return api.post('admin/' + path, { json: data }).json();
};

export const updateData = (path, id, data) => {
  return api.put(`admin/${path}/${id}`, { json: data }).json();
};

export const deleteData = (path, id) => {
  return api.delete(`admin/${path}/${id}`);
};

export const bulkUpdateInventory = data => {
  return api.put(`admin/inventory-items-bulk`, { json: data });
};

export const getCustomersByPartner = id => {
  return api.get('admin/customers?partner=' + id).json();
};

// Page Edit Products//
export const getProfitProducts = () => {
  return api.get('admin/product_profit').json();
};

export const updateProfitProduct = product => {
  return api.post(`admin/product_profit`, { json: product }).json();
};

export const updateOrderStatus = ({ orderId, cart, productId, status }) => {
  return api
    .put(`admin/order_status/${orderId}`, {
      json: { product_id: productId, cart, status }
    })
    .json();
};

export const updateCustomerOrderNote = async (note, id) => {
  return await api.put(`admin/customer-orders-note/${id}`, { json: { note } });
};

export const updateHotProduct = product => {
  return api.post(`admin/hot_product`, { json: product }).json();
};

export const getHotProducts = product => {
  return api.get(`admin/hot_product`).json();
};

export const addReview = review => {
  return api.post('admin/review', { json: review }).text();
};

export const getReview = () => {
  return api.get('admin/review').json();
};

export const updateReview = (id, review) => {
  return api.put(`admin/review/${id}`, { json: review });
};

export const deleteReview = id => {
  return api.delete(`admin/review/${id}`);
};

export const addFlashSaleItem = flashSaleItem => {
  return api.post('admin/flash_sale_item', { json: flashSaleItem }).json();
};

export const getFlashSaleItems = () => {
  return api.get('admin/flash_sale_item').json();
};

export const getFlashSaleItem = id => {
  return api.get(`admin/flash_sale_item/${id}`).json();
};

export const updateFlashSaleItem = (id, data) => {
  return api.put(`admin/flash_sale_item/${id}`, { json: data }).json();
};

export const deleteFlashSaleItem = id => {
  return api.delete(`admin/flash_sale_item/${id}`);
};

export const addProgressItem = progressItem => {
  return api.post('admin/progress_item', { json: progressItem }).text();
};

export const getProgressItems = () => {
  return api.get('admin/progress_item').json();
};

export const updateProgressItem = (id, data) => {
  return api.put(`admin/progress_item/${id}`, { json: data });
};

export const deleteProgressItem = id => {
  return api.delete(`admin/progress_item/${id}`);
};


export const addConfigItem = progressItem => {
  return api.post('admin/config', { json: progressItem }).text();
};

export const getConfigItems = () => {
  return api.get('admin/config').json();
};

export const updateConfigItem = (id, data) => {
  return api.put(`admin/config/${id}`, { json: data });
};

export const deleteConfigItem = id => {
  return api.delete(`admin/config/${id}`);
};
