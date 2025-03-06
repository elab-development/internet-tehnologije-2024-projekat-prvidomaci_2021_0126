import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Breadcrumbs.css';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);
  let breadcrumbPath = '';

  // Map URL segments to friendly names
  const pathDisplayMap = {
    'users': 'Users',
    'new-account': 'New Account',
    'accounts': 'Accounts',
    'cards': 'Cards',
    'new-card': 'New Card',
  };

  // Handle dynamic segments (e.g., user IDs, account IDs)
  const getDisplayName = (segment, index, segments) => {
    // Replace numeric IDs with context-specific labels
    if (!isNaN(segment)) {
      const parentSegment = segments[index - 1];
      switch (parentSegment) {
        case 'users':
          return 'User Details';
        case 'accounts':
          return 'Account Details';
        default:
          return segment;
      }
    }
    return pathDisplayMap[segment] || segment.replace(/-/g, ' ');
  };

  // Check if a segment should be a link
  const shouldLink = (segment, index, segments) => {
    // Do not link numeric IDs (e.g., user IDs, account IDs)
    if (!isNaN(segment)) {
      return false;
    }
    // Do not link "new-account" if it's followed by a user ID
    if (segment === 'new-account' && segments[index + 1] && !isNaN(segments[index + 1])) {
      return false;
    }
    return true;
  };

  return (
    <div className="breadcrumbs">
      {pathnames.length > 0 && <Link to="/">Home</Link>}

      {pathnames.map((name, index) => {
        breadcrumbPath += `/${name}`;
        const isLast = index === pathnames.length - 1;
        const displayName = getDisplayName(name, index, pathnames);
        const shouldCreateLink = shouldLink(name, index, pathnames);

        return isLast ? (
          <span key={breadcrumbPath}> / {displayName}</span>
        ) : shouldCreateLink ? (
          <Link to={breadcrumbPath} key={breadcrumbPath}>
            <span> / {displayName}</span>
          </Link>
        ) : (
          <span key={breadcrumbPath}> / {displayName}</span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;