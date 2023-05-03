#!/bin/sh
export DEV_COOKIE=$(curl -i -X POST localhost:8080/~/login -d 'password=magsub-micsev-bacmug-moldex' | grep set-cookie | awk '{print $2}' | awk -F ';' '{print $1}')
echo $DEV_COOKIE
#
# This script doesn't do much for you because %lick vane isn't ready yet.
# Just run the below commands in order.

# Assumes base dir is in (urbit/urbit repo from github)/pkg and this script is running from pkg/alzabo
# cd ..
# ./symbolic-merge.sh base-dev alzabo
# ./dev/.run

# Then in ~dev dojo (uncomment and copypaste all of the following lines):
# |new-desk %alzabo
# |cp %/mar/mime/hoon /=alzabo=/mar/mime/hoon
# |cp %/mar/txt-diff/hoon /=alzabo=/mar/txt-diff/hoon
# |cp %/mar/ship/hoon /=alzabo=/mar/ship/hoon
# |cp %/mar/bill/hoon /=alzabo=/mar/bill/hoon
# |cp /=garden=/mar/docket-0/hoon /=alzabo=/mar/docket-0/hoon
# |cp /=garden=/sur/docket/hoon /=alzabo=/sur/docket/hoon
# |cp /=garden=/lib/docket/hoon /=alzabo=/lib/docket/hoon
# |mount %alzabo

# ./copy-in.sh

# |commit %alzabo
# |install our %alzabo