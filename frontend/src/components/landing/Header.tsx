import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import type { LucideIcon } from 'lucide-react';
import {
  CodeIcon,
  GlobeIcon,
  LayersIcon,
  UserPlusIcon,
  Users,
  Star,
  FileText,
  Shield,
  RotateCcw,
  Handshake,
  Leaf,
  HelpCircle,
  BarChart,
  PlugIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
}

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    <NavigationMenuLink
      asChild
      className={cn(
        'w-full flex flex-row gap-x-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2',
        className
      )}
      {...props}
    >
      <a href={href}>
        <div className="bg-background/40 flex aspect-square size-12 items-center justify-center rounded-md border shadow-sm">
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </a>
    </NavigationMenuLink>
  );
}

const productLinks: LinkItem[] = [
  { title: 'Website Builder', href: '#', description: 'Create responsive websites with ease', icon: GlobeIcon },
  { title: 'Cloud Platform', href: '#', description: 'Deploy and scale apps in the cloud', icon: LayersIcon },
  { title: 'Team Collaboration', href: '#', description: 'Tools to help your teams work better together', icon: UserPlusIcon },
  { title: 'Analytics', href: '#', description: 'Track and analyze your website traffic', icon: BarChart },
  { title: 'Integrations', href: '#', description: 'Connect your apps and services', icon: PlugIcon },
  { title: 'API', href: '#', description: 'Build custom integrations with our API', icon: CodeIcon },
];

const companyLinks: LinkItem[] = [
  { title: 'About Us', href: '#', description: 'Learn more about our story and team', icon: Users },
  { title: 'Customer Stories', href: '#', description: "See how we've helped our clients succeed", icon: Star },
  { title: 'Partnerships', href: '#', description: 'Collaborate with us for mutual growth', icon: Handshake },
];

const companyLinks2: LinkItem[] = [
  { title: 'Terms of Service', href: '#', icon: FileText },
  { title: 'Privacy Policy', href: '#', icon: Shield },
  { title: 'Refund Policy', href: '#', icon: RotateCcw },
  { title: 'Blog', href: '#', icon: Leaf },
  { title: 'Help Center', href: '#', icon: HelpCircle },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
        'bg-white/95 border-gray-200 backdrop-blur-lg': scrolled,
      })}
    >
      <nav className="relative mx-auto flex h-[3.875rem] w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-start">
          <a href="/" className="flex items-center gap-2 rounded-md p-2 -ml-2 hover:bg-gray-100">
            <span
              style={{
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                fontSize: '19px',
                fontWeight: 800,
                lineHeight: '24px',
                letterSpacing: '-0.04em',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              PowerSuraksha
            </span>
          </a>
        </div>

        {/* Navigation Menu (Center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Product</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white p-1 pr-1.5">
                  <ul className="bg-white grid w-[500px] grid-cols-2 gap-2 rounded-md border p-2 shadow">
                    {productLinks.map((item, i) => (
                      <li key={i}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-2">
                    <p className="text-gray-500 text-sm">
                      Interested?{' '}
                      <a href="#" className="text-gray-900 font-medium hover:underline">
                        Schedule a demo
                      </a>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white p-1 pr-1.5 pb-1.5">
                  <div className="grid w-[500px] grid-cols-2 gap-2">
                    <ul className="bg-white space-y-2 rounded-md border p-2 shadow">
                      {companyLinks.map((item, i) => (
                        <li key={i}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2 p-3">
                      {companyLinks2.map((item, i) => (
                        <li key={i}>
                          <NavigationMenuLink
                            href={item.href}
                            className="flex p-2 hover:bg-gray-100 flex-row rounded-md items-center gap-x-2"
                          >
                            <item.icon className="size-4" />
                            <span className="font-medium">{item.title}</span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <a href="#" className="hover:bg-gray-100 rounded-md p-2 flex items-center px-4 font-medium transition-colors">
                    Pricing
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-6">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}
