import { ContactForm } from '@/app/components/ContactForm';

export const metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about Law App? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">info@lawapp.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9am - 5pm EST</p>
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
