document.addEventListener('DOMContentLoaded', () => {
    const createCartBtn = document.getElementById('createCartBtn');
    const viewCartLink = document.getElementById('viewCartLink');
    let cartId = null;

    // 1. Crear carrito
    createCartBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/carts', { method: 'POST' });
            const data = await response.json();
            
            if (data.status === 'success') {
                cartId = data.payload._id;
                viewCartLink.href = `/carts/${cartId}`;
                viewCartLink.style.display = 'inline-block';
                createCartBtn.style.display = 'none';
                alert('¡Carrito creado! Ahora puedes agregar productos.');
            }
        } catch (error) {
            alert('Error al crear el carrito: ' + error.message);
        }
    });

    // 2. Agregar productos al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            if (!cartId) {
                alert('Primero crea un carrito.');
                return;
            }

            const productId = button.getAttribute('data-product-id');
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { 
                    method: 'POST' 
                });
                const data = await response.json();
                
                if (data.status === 'success') {
                    alert('Producto agregado al carrito.');
                }
            } catch (error) {
                alert('Error al agregar producto: ' + error.message);
            }
        });
    });
});