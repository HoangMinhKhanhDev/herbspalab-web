import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

const Breadcrumb = ({ items }: { items: Crumb[] }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    {items.map((item, i) => (
      <span key={i} className="breadcrumb-item">
        {i > 0 && <ChevronRight size={14} className="breadcrumb-sep" />}
        {item.to && i < items.length - 1 ? (
          <Link to={item.to}>{item.label}</Link>
        ) : (
          <span aria-current={i === items.length - 1 ? 'page' : undefined}>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
