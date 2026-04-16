import React from 'react';
import type { Language, Service } from '../../types';

interface ServiceCardProps {
    language: Language;
    onApplyClick: (serviceId: string) => void;
}

const ServiceCards: React.FC<ServiceCardProps> = ({ language, onApplyClick }) => {
    const services: Service[] = [
        {
            id: 'citizenship-certificate',
            name: 'Citizenship Certificate',
            nameNp: 'नागरिकता प्रमाणपत्र',
            description: 'Apply for citizenship certificate or get duplicate copy',
            descriptionNp: 'नयाँ वा नक्कल नागरिकता प्रमाणपत्रको लागि',
            icon: '🆔',
            processingTime: '15-30 Workday',
            processingTimeNp: '१५-३० कार्यदिन'
        },
        {
            id: 'birth-certificate',
            name: 'Birth Certificate',
            nameNp: 'जन्म दर्ता',
            description: 'Register new birth or get certificate copy',
            descriptionNp: 'नयाँ जन्म दर्ता वा प्रतिलिपि को लागि',
            icon: '👶',
            processingTime: '7-15 Workday',
            processingTimeNp: '७-१५ कार्यदिन'
        },
        {
            id: 'marriage-registration',
            name: 'Marriage Registration',
            nameNp: 'विवाह दर्ता',
            description: 'Register marriage and get official certificate',
            descriptionNp: 'विवाह दर्ता र आधिकारिक प्रमाणपत्र को लागि',
            icon: '💍',
            processingTime: '7-15 Workday',
            processingTimeNp: '७-१५ कार्यदिन'
        }
    ];

    return (
        <section id='services' className='py-20 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-12'>
                    {language === 'np' ? 'हाम्रा सेवाहरू' : 'Our Services'}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {services.map((service) => (
                        <div key={service.id} className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow'>
                            <div className='text-4xl mb-4'>{service.icon}</div>
                            <h3 className='text-xl font-bold mb-2'>
                                {language === 'np' ? service.nameNp : service.name}
                            </h3>
                            <p className='text-gray-600 mb-4'>
                                {language === 'np' ? service.descriptionNp : service.description}
                            </p>
                            <div className='space-y-2 mb-6'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-700'>{language === 'np' ? 'समय:' : 'Time:'}</span>
                                    <span className="font-medium">{language === 'np' ? service.processingTimeNp : service.processingTime}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => onApplyClick(service.id)}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                {language === 'np' ? 'अबै लागू गर्नुहोस्' : 'Apply Now'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceCards;