#!/bin/bash
 
 
sync_repos() {

    git checkout master
    git pull landi master

    git checkout gh-pages
    git merge master

    if [ $? -ne 0 ]; then
        echo "Merge failed"
        git merge --abort 2> /dev/null
        git reset --hard landi/gh-pages
        git clean -df
        exit 1
    fi

    git push landi gh-pages
    echo "Branches synced."
}

sync_repos

