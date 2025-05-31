const NotFoundPage = {
  async render() {
    return `
      <section class="not-found">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="btn">Kembali ke Beranda</a>
      </section>
    `;
  },

  async afterRender() {
  },
};

export default NotFoundPage;