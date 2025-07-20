// Eliminar producto del carrito
document.querySelectorAll('.remove-from-cart').forEach(button => {
  button.addEventListener('click', async () => {
    const productId = button.dataset.productId;
    const cartId = '{{cart._id}}'; // Obtiene el ID del carrito actual
    
    try {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        window.location.reload(); // Recargar para ver cambios
      } else {
        alert(result.message || 'Error al eliminar producto');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});

document.getElementById('emptyCartBtn')?.addEventListener('click', async () => {
    if (!confirm('¿Estas seguro de vaciar el carrito? Todos los productos se eliminarán.'))
      return;
    try{
      const response = await fetch(`/api/carts/${cartId}/empty`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.status === 'success') {
        showAlert('success', 'Carrito eliminado correctamente');
        settimeout(() => window.location.reload(), 1500)
      }else{
        showAlert('error', `Error: ${result.message || 'No se pudo vaciar el carrito'}`)
      }
    }catch(error){
      showAlert('error', 'Error de conexion: ' + error.message)
    }
  })

// Finalizar compra (opcional)
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  // Implementar lógica de checkout
});