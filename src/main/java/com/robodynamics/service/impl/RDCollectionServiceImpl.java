package com.robodynamics.service.impl;

import com.robodynamics.dao.RDCollectionDao;
import com.robodynamics.model.RDCollection;
import com.robodynamics.service.RDCollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDCollectionServiceImpl implements RDCollectionService {

    @Autowired
    private RDCollectionDao collectionDao;

    @Override
    @Transactional  // Ensures that the Hibernate session is open during this method call
    public List<RDCollection> getCollections() {
        List<RDCollection> collections = collectionDao.getCollections();
        
        // Initialize the collection to avoid LazyInitializationException
        for (RDCollection collection : collections) {
            collection.getCourseIds().size();  // Forces Hibernate to load the lazy-loaded collection
        }

        return collections;
    }
}
