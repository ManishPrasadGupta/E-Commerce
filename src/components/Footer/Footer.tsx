import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gradient-to-t from-slate-950 via-slate-900 to-blue-800/50 text-slate-100 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between gap-10 py-10">
          {/* Brand & About */}
          <div className="flex flex-col lg:w-1/3">
            <Link
              href="/"
              className="flex justify-center lg:justify-start items-center gap-3 group"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-cyan-400 to-sky-500 shadow-xl">
                {/* Electronics icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
                </svg>
              </span>
              <span className="text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                Electech
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-300 text-center lg:text-left">
              Your one-stop shop for the latest gadgets and electech. Quality
              products, unbeatable prices, and fast delivery!
            </p>
          </div>

          {/* Navigation and Social */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10 lg:w-2/3">
            <div>
              <h3 className="uppercase font-bold text-slate-200 mb-3 tracking-wide">
                Shop
              </h3>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <Link
                    href="/productsgallery"
                    className="hover:text-cyan-300 transition"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Deals & Offers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Brands
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-bold text-slate-200 mb-3 tracking-wide">
                Customer Service
              </h3>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Returns & Warranty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Shipping Info
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-bold text-slate-200 mb-3 tracking-wide">
                About
              </h3>
              <ul className="space-y-1 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="uppercase font-bold text-slate-200 mb-3 tracking-wide">
                Stay Connected
              </h3>
              <div className="flex space-x-2 mb-4">
                <a
                  href="#"
                  title="Facebook"
                  className="p-2 rounded-full bg-slate-800 hover:bg-blue-600 transition shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    className="w-5 h-5 text-slate-200 hover:text-white transition"
                  >
                    <path d="M32 16c0-8.839-7.167-16-16-16-8.839 0-16 7.161-16 16 0 7.984 5.849 14.604 13.5 15.803v-11.177h-4.063v-4.625h4.063v-3.527c0-4.009 2.385-6.223 6.041-6.223 1.751 0 3.584 0.312 3.584 0.312v3.937h-2.021c-1.984 0-2.604 1.235-2.604 2.5v3h4.437l-0.713 4.625h-3.724v11.177c7.645-1.199 13.5-7.819 13.5-15.803z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  title="Twitter"
                  className="p-2 rounded-full bg-slate-800 hover:bg-cyan-400 transition shadow-md"
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-slate-200 hover:text-white transition"
                  >
                    <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  title="Instagram"
                  className="p-2 rounded-full bg-slate-800 hover:bg-pink-500 transition shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    fill="currentColor"
                    className="w-5 h-5 text-slate-200 hover:text-white transition"
                  >
                    <path d="M16 0c-4.349 0-4.891 0.021-6.593 0.093-1.709 0.084-2.865 0.349-3.885 0.745-1.052 0.412-1.948 0.959-2.833 1.849-0.891 0.885-1.443 1.781-1.849 2.833-0.396 1.020-0.661 2.176-0.745 3.885-0.077 1.703-0.093 2.244-0.093 6.593s0.021 4.891 0.093 6.593c0.084 1.704 0.349 2.865 0.745 3.885 0.412 1.052 0.959 1.948 1.849 2.833 0.885 0.891 1.781 1.443 2.833 1.849 1.020 0.391 2.181 0.661 3.885 0.745 1.703 0.077 2.244 0.093 6.593 0.093s4.891-0.021 6.593-0.093c1.704-0.084 2.865-0.355 3.885-0.745 1.052-0.412 1.948-0.959 2.833-1.849 0.891-0.885 1.443-1.776 1.849-2.833 0.391-1.020 0.661-2.181 0.745-3.885 0.077-1.703 0.093-2.244 0.093-6.593s-0.021-4.891-0.093-6.593c-0.084-1.704-0.355-2.871-0.745-3.885-0.412-1.052-0.959-1.948-1.849-2.833-0.885-0.891-1.776-1.443-2.833-1.849-1.020-0.396-2.181-0.661-3.885-0.745-1.703-0.077-2.244-0.093-6.593-0.093zM16 2.88c4.271 0 4.781 0.021 6.469 0.093 1.557 0.073 2.405 0.333 2.968 0.553 0.751 0.291 1.276 0.635 1.844 1.197 0.557 0.557 0.901 1.088 1.192 1.839 0.22 0.563 0.48 1.411 0.553 2.968 0.072 1.688 0.093 2.199 0.093 6.469s-0.021 4.781-0.099 6.469c-0.084 1.557-0.344 2.405-0.563 2.968-0.303 0.751-0.641 1.276-1.199 1.844-0.563 0.557-1.099 0.901-1.844 1.192-0.556 0.22-1.416 0.48-2.979 0.553-1.697 0.072-2.197 0.093-6.479 0.093s-4.781-0.021-6.48-0.099c-1.557-0.084-2.416-0.344-2.979-0.563-0.76-0.303-1.281-0.641-1.839-1.199-0.563-0.563-0.921-1.099-1.197-1.844-0.224-0.556-0.48-1.416-0.563-2.979-0.057-1.677-0.084-2.197-0.084-6.459 0-4.26 0.027-4.781 0.084-6.479 0.083-1.563 0.339-2.421 0.563-2.979 0.276-0.761 0.635-1.281 1.197-1.844 0.557-0.557 1.079-0.917 1.839-1.199 0.563-0.219 1.401-0.479 2.964-0.557 1.697-0.061 2.197-0.083 6.473-0.083zM16 7.787c-4.541 0-8.213 3.677-8.213 8.213 0 4.541 3.677 8.213 8.213 8.213 4.541 0 8.213-3.677 8.213-8.213 0-4.541-3.677-8.213-8.213-8.213zM16 21.333c-2.948 0-5.333-2.385-5.333-5.333s2.385-5.333 5.333-5.333c2.948 0 5.333 2.385 5.333 5.333s-2.385 5.333-5.333 5.333zM26.464 7.459c0 1.063-0.865 1.921-1.923 1.921-1.063 0-1.921-0.859-1.921-1.921 0-1.057 0.864-1.917 1.921-1.917s1.923 0.86 1.923 1.917z"></path>
                  </svg>
                </a>
              </div>
              {/* Newsletter */}
              <form className="mt-3 flex flex-col space-y-2">
                <label htmlFor="newsletter" className="text-xs text-slate-300">
                  Subscribe to our newsletter
                </label>
                <div className="flex">
                  <input
                    type="email"
                    id="newsletter"
                    placeholder="Your email"
                    className="w-full px-2 py-1 border border-slate-600 bg-slate-950 text-slate-100 placeholder:text-slate-400 rounded-l outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-r hover:brightness-110 transition"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <div className="mt-4 flex space-x-2 text-xs text-slate-400">
                <span>Visa</span>
                <span>Mastercard</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 pb-4 text-sm text-center text-slate-400">
          © 2025 Electech. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
