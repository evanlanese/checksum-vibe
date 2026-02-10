// Product Manager - Create/Edit Page

class ProductForm {
    constructor() {
        this.currentProductId = this.getProductIdFromUrl();
        this.products = this.loadProducts();
        this.init();
    }

    init() {
        if (this.currentProductId) {
            this.loadProductData();
            document.getElementById('pageTitle').textContent = 'Edit Product';
            document.getElementById('deleteBtn').style.display = 'inline-block';
        }
        this.attachEventListeners();
    }

    getProductIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    loadProducts() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    loadProductData() {
        const product = this.products.find(p => p.id === this.currentProductId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
        }
    }

    attachEventListeners() {
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.openModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });
    }

    saveProduct() {
        const name = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();

        if (!name || !description) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (this.currentProductId) {
            const productIndex = this.products.findIndex(p => p.id === this.currentProductId);
            if (productIndex !== -1) {
                this.products[productIndex] = {
                    ...this.products[productIndex],
                    name,
                    description,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            const newProduct = {
                id: this.generateId(),
                name,
                description,
                createdAt: new Date().toISOString()
            };
            this.products.push(newProduct);
        }

        this.saveProducts();
        this.showToast('Product created successfully');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    confirmDelete() {
        if (!this.currentProductId) return;

        this.products = this.products.filter(p => p.id !== this.currentProductId);
        this.saveProducts();
        this.closeModal();
        this.showToast('Product deleted successfully');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    openModal() {
        document.getElementById('deleteModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('deleteModal').classList.remove('active');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showToast(message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

const productForm = new ProductForm();
