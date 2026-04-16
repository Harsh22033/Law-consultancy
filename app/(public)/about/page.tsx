export const metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Law App</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Law App is a modern, comprehensive platform designed to streamline law firm operations
          and improve case management efficiency.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          We believe that law firms deserve better tools. Our mission is to provide a centralized
          system that enables lawyers, clients, and employees to collaborate effectively and manage
          cases with confidence.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Centralized case management system</li>
          <li>Real-time task tracking and assignment</li>
          <li>Secure role-based access control</li>
          <li>Client communication portal</li>
          <li>Comprehensive reporting and analytics</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us</h2>
        <p className="text-gray-600 mb-6">
          Law App combines ease of use with powerful features. Whether you&apos;re a solo practitioner
          or managing a large firm, our platform scales with your needs and helps you focus on
          what matters most: serving your clients.
        </p>
      </div>
    </div>
  );
}
