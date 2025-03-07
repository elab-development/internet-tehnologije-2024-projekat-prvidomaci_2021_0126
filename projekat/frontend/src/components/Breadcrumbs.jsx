import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/Breadcrumbs.css';

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter((x) => x);
  let breadcrumbPath = '';

  // mapping url segments
  const pathDisplayMap = {
    'users': 'Users',
    'new-account': 'New Account',
    'accounts': 'Accounts',
    'cards': 'Cards',
    'new-card': 'New Card',
  };

  // handle dynamic segments 
  const getDisplayName = (segment, index, segments) => {
    // replace numeric IDs with labels
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

  // check if a segment should be a link
  const shouldLink = (segment, index, segments) => {
    // do not link numeric IDs
    if (!isNaN(segment)) {
      return false;
    }
    // do not link new-account if it's followed by a user ID
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