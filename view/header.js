class Header extends HTMLElement {

    connectedCallback() {
        this.innerHTML = `
            <div class="header">
                <img src="images/header.svg" alt="PokeAPI logo">
                <nav class="navbar">
                     <a href="index.html">Home</a>
                    <a href="wishlist.html">Wishlist</a>
                </nav>  
            </div>
            
            <div class="filters-container">


            </div>

            </div>

          `
    }
}

customElements.define('main-header', Header);