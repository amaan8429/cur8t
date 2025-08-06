import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { PiPlus, PiSparkle } from 'react-icons/pi';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion';

const items = [
  {
    id: '1',
    title: 'What makes Cur8t different?',
    content:
      "Cur8t is a powerful bookmark manager that helps you organize, discover, and share your favorite web content. With smart collections, AI-powered extraction, and seamless browser integration, it's designed to make your digital life more organized.",
  },
  {
    id: '2',
    title: 'How can I organize my bookmarks?',
    content:
      'Create custom collections for different topics, add tags and descriptions, and use our smart categorization features. You can also make collections public to share with others or keep them private for personal use.',
  },
  {
    id: '3',
    title: 'Is Cur8t free to use?',
    content:
      'Yes! Cur8t offers a generous free tier that includes basic bookmark management, collections, and browser extension access. Premium features are available for users who need advanced functionality.',
  },
  {
    id: '4',
    title: 'Can I import my existing bookmarks?',
    content:
      'Absolutely! Cur8t supports importing bookmarks from all major browsers including Chrome, Firefox, Safari, and Edge. Your existing folder structure will be preserved during import.',
  },
  {
    id: '5',
    title: 'How does the browser extension work?',
    content:
      'Our browser extension lets you save any webpage to your collections with a single click. You can organize bookmarks, add notes, and access your collections directly from your browser toolbar.',
  },
];

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
      duration: 0.4,
    },
  }),
};

export default function Faq1() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
          >
            <PiSparkle className="text-primary mr-1 h-3.5 w-3.5 animate-pulse" />
            FAQ
          </Badge>
          <motion.h1
            className="from-foreground to-foreground/30 bg-gradient-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="text-muted-foreground mx-auto max-w-md pt-2 text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to know about Cur8t and how to organize your
            bookmarks effectively.
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Decorative gradient */}
          <div className="bg-primary/10 absolute -top-4 -left-4 -z-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="bg-primary/10 absolute -right-4 -bottom-4 -z-10 h-72 w-72 rounded-full blur-3xl" />

          <Accordion
            type="single"
            collapsible
            className="border-border/40 bg-card/30 w-full rounded-xl border p-2 backdrop-blur-sm"
            defaultValue="1"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={item.id}
                  className={cn(
                    'bg-card/50 my-1 overflow-hidden rounded-lg border-none px-2 shadow-sm transition-all',
                    'data-[state=open]:bg-card/80 data-[state=open]:shadow-md'
                  )}
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        'group flex flex-1 items-center justify-between gap-4 py-4 text-left text-base font-medium',
                        'hover:text-primary transition-all duration-300 outline-none',
                        'focus-visible:ring-primary/50 focus-visible:ring-2',
                        'data-[state=open]:text-primary'
                      )}
                    >
                      {item.title}
                      <PiPlus
                        size={18}
                        className={cn(
                          'text-primary/70 shrink-0 transition-transform duration-300 ease-out',
                          'group-data-[state=open]:rotate-45'
                        )}
                        aria-hidden="true"
                      />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionContent
                    className={cn(
                      'text-muted-foreground overflow-hidden pt-0 pb-4',
                      'data-[state=open]:animate-accordion-down',
                      'data-[state=closed]:animate-accordion-up'
                    )}
                  >
                    <div className="border-border/30 border-t pt-3">
                      {item.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
