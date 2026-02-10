// Product Manager - Home Page

class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.currentFilter = '';
        this.productToDelete = null;
        this.init();
    }

    init() {
        this.renderProducts();
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.getElementById('createProductBtn').addEventListener('click', () => {
            window.location.href = 'create.html';
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            this.clearSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });
    }

    loadProducts() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    getFilteredProducts() {
        if (!this.currentFilter) {
            return this.products;
        }
        return this.products.filter(product =>
            product.name.toLowerCase().includes(this.currentFilter.toLowerCase())
        );
    }

    renderProducts() {
        const productList = document.getElementById('productList');
        const filteredProducts = this.getFilteredProducts();

        if (filteredProducts.length === 0) {
            productList.innerHTML = `
                <div class="empty-state">
                    <h2>No products found</h2>
                    <p>${this.currentFilter ? 'Try adjusting your search criteria' : 'Create your first product to get started'}</p>
                </div>
            `;
            return;
        }

        productList.innerHTML = filteredProducts.map(product => `
            <div class="product-item" data-id="${product.id}">
                <div class="product-header">
                    <div class="product-info">
                        <div class="product-label">Name:</div>
                        <div class="product-name">${this.escapeHtml(product.name)}</div>
                    </div>
                </div>
                <div>
                    <div class="product-label">Description:</div>
                    <div class="product-description">${this.escapeHtml(product.description)}</div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-edit" onclick="productManager.editProduct('${product.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="productManager.deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        this.currentFilter = searchInput.value.trim();
        this.renderProducts();
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        this.currentFilter = '';
        this.renderProducts();
    }

    editProduct(id) {
        window.location.href = `create.html?id=${id}`;
    }

    deleteProduct(id) {
        this.productToDelete = id;
        this.openModal();
    }

    confirmDelete() {
        if (!this.productToDelete) return;

        this.products = this.products.filter(p => p.id !== this.productToDelete);
        this.saveProducts();
        this.renderProducts();
        this.closeModal();
        this.showToast('Product deleted successfully');
        this.productToDelete = null;
    }

    openModal() {
        document.getElementById('deleteModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('deleteModal').classList.remove('active');
        this.productToDelete = null;
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

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const productManager = new ProductManager();
