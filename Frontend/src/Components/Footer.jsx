const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Book Store. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10">
          <p href="/privacy-policy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </p>
          <p
            href="/terms-of-service"
            className="text-gray-300 hover:text-white"
          >
            Terms of Service
          </p>
          <p href="/contact" className="text-gray-300 hover:text-white">
            Contact Us
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
