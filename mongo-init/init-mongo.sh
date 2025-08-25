#!/bin/bash
set -e

# Create the payload user and database
mongosh <<EOF
use admin
db.createUser({
  user: 'payload',
  pwd: 'payloadpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'payload-example-multi-tenant'
    }
  ]
});

use payload-example-multi-tenant
db.createUser({
  user: 'payload',
  pwd: 'payloadpassword',
  roles: [
    {
      role: 'readWrite',
      db: 'payload-example-multi-tenant'
    }
  ]
});
EOF
