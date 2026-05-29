import { Request, Response } from 'express';

export const addToWishlist = (req: Request, res: Response) => {
    const { userId, productId } = req.body;


    res.status(200).json({ message: 'Product added to wishlist' });
};

export const removeFromWishlist = (req: Request, res: Response) => {
    // Logic to remove a product from the user's wishlist
    res.status(200).json({ message: 'Product removed from wishlist' });
};

export const getWishlist = (req: Request, res: Response) => {
    // Logic to retrieve the user's wishlist
    res.status(200).json({ wishlist: [] }); // Replace with actual wishlist data
};

export const clearWishlist = (req: Request, res: Response) => {
    // Logic to clear the user's wishlist
    res.status(200).json({ message: 'Wishlist cleared' });
};


//! add/remove product from wishlist 

//! get wishlist

//! clear wishlist 