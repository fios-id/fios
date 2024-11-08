// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Fios {
    uint256 public constant REQUIRED_STAKE = 0.001 ether;

    enum AttestationStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Document {
        string cid;
        AttestationStatus status;
        string rejectionReason;
        address owner;
    }

    struct Attester {
        bool isActive;
        uint256 stakedAmount;
    }

    // State variables
    mapping(address => Document[]) public userDocuments;
    Document[] public allPendingDocuments;
    mapping(address => mapping(uint256 => uint256))
        public documentToPendingIndex;
    mapping(address => Attester) public attesters;
    uint256 public documentCount;

    // New state variables for statistics
    uint256 public totalDocuments;
    uint256 public totalApprovedDocuments;
    uint256 public totalAttesters;

    // Events
    event AttesterAdded(address indexed attester);
    event DocumentSubmitted(
        address indexed user,
        uint256 indexed documentIndex,
        string cid
    );
    event DocumentAttested(
        address indexed user,
        uint256 indexed documentIndex,
        AttestationStatus status,
        string rejectionReason
    );
    event DocumentApproved(address indexed user, uint256 indexed documentIndex);
    event AttesterRegistered(address indexed attester);

    modifier onlyAttester() {
        require(attesters[msg.sender].isActive, "Not an attester");
        _;
    }

    function becomeAttester() external payable {
        require(!attesters[msg.sender].isActive, "Already an attester");
        require(msg.value == REQUIRED_STAKE, "Incorrect stake amount");

        attesters[msg.sender] = Attester({
            isActive: true,
            stakedAmount: msg.value
        });

        emit AttesterAdded(msg.sender);

        totalAttesters++; // Increment total attesters
        emit AttesterRegistered(msg.sender);
    }

    function submitDocument(string memory cid) external {
        require(bytes(cid).length > 0, "Empty CID");

        Document memory newDoc = Document({
            cid: cid,
            status: AttestationStatus.Pending,
            rejectionReason: "",
            owner: msg.sender
        });

        // Add to user's documents
        userDocuments[msg.sender].push(newDoc);
        uint256 docIndex = userDocuments[msg.sender].length - 1;

        // Add to pending documents array
        allPendingDocuments.push(newDoc);
        // Store the user's document index, not the pending array index
        documentToPendingIndex[msg.sender][docIndex] = docIndex;

        documentCount++;

        emit DocumentSubmitted(msg.sender, docIndex, cid);

        totalDocuments++; // Increment total documents
    }

    function approveDocument(
        address user,
        uint256 documentIndex
    ) external onlyAttester {
        require(
            documentIndex < userDocuments[user].length,
            "Invalid document index"
        );
        Document storage doc = userDocuments[user][documentIndex];

        require(
            doc.status == AttestationStatus.Pending,
            "Not in pending status"
        );

        doc.status = AttestationStatus.Approved;

        _removeFromPendingArray(user, documentIndex);

        emit DocumentAttested(
            user,
            documentIndex,
            AttestationStatus.Approved,
            ""
        );

        totalApprovedDocuments++; // Increment approved documents
        emit DocumentApproved(user, documentIndex);
    }

    function isAttester(address user) external view returns (bool) {
        return attesters[user].isActive;
    }

    function rejectDocument(
        address user,
        uint256 documentIndex,
        string memory reason
    ) external onlyAttester {
        require(
            documentIndex < userDocuments[user].length,
            "Invalid document index"
        );
        Document storage doc = userDocuments[user][documentIndex];

        require(
            doc.status == AttestationStatus.Pending,
            "Not in pending status"
        );
        require(bytes(reason).length > 0, "Must provide rejection reason");

        doc.status = AttestationStatus.Rejected;
        doc.rejectionReason = reason;

        _removeFromPendingArray(user, documentIndex);

        emit DocumentAttested(
            user,
            documentIndex,
            AttestationStatus.Rejected,
            reason
        );
    }

    function getMyPendingDocuments()
        external
        view
        returns (
            address[] memory userAddresses,
            uint256[] memory indices,
            string[] memory cids
        )
    {
        uint256 validCount = 0;
        for (uint256 i = 0; i < allPendingDocuments.length; i++) {
            if (allPendingDocuments[i].owner != msg.sender) {
                validCount++;
            }
        }

        userAddresses = new address[](validCount);
        indices = new uint256[](validCount);
        cids = new string[](validCount);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < allPendingDocuments.length; i++) {
            if (allPendingDocuments[i].owner != msg.sender) {
                userAddresses[currentIndex] = allPendingDocuments[i].owner;
                // Use the original document index, not the pending array index
                indices[currentIndex] = documentToPendingIndex[
                    allPendingDocuments[i].owner
                ][i];
                cids[currentIndex] = allPendingDocuments[i].cid;
                currentIndex++;
            }
        }

        return (userAddresses, indices, cids);
    }

    function getUserDocuments(
        address user
    )
        external
        view
        returns (
            string[] memory cids,
            AttestationStatus[] memory status,
            string[] memory rejectionReasons
        )
    {
        Document[] storage docs = userDocuments[user];
        uint256 length = docs.length;

        cids = new string[](length);
        status = new AttestationStatus[](length);
        rejectionReasons = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            Document storage doc = docs[i];
            cids[i] = doc.cid;
            status[i] = doc.status;
            rejectionReasons[i] = doc.rejectionReason;
        }

        return (cids, status, rejectionReasons);
    }

    function _removeFromPendingArray(
        address user,
        uint256 documentIndex
    ) internal {
        uint256 pendingIndex = documentToPendingIndex[user][documentIndex];

        // Move the last element to the position of the element being removed
        if (pendingIndex < allPendingDocuments.length - 1) {
            allPendingDocuments[pendingIndex] = allPendingDocuments[
                allPendingDocuments.length - 1
            ];
            // Update the index mapping for the moved element
            documentToPendingIndex[allPendingDocuments[pendingIndex].owner][
                documentIndex
            ] = pendingIndex;
        }

        // Remove the last element
        allPendingDocuments.pop();
        delete documentToPendingIndex[user][documentIndex];
    }

    // New getter functions for statistics
    function getStatistics() external view returns (uint256, uint256, uint256) {
        return (totalDocuments, totalApprovedDocuments, totalAttesters);
    }
}
