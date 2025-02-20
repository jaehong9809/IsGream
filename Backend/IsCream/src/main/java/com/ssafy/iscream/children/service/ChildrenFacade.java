package com.ssafy.iscream.children.service;

import com.ssafy.iscream.bigFiveTest.service.BigFiveTestService;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.common.exception.ErrorCode;
import com.ssafy.iscream.common.exception.MinorException;
import com.ssafy.iscream.htpTest.service.HtpSelectService;
import com.ssafy.iscream.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChildrenFacade {

    private final S3Service s3Service;

    private final ChildrenService childrenService;
    private final HtpSelectService htpSelectService;
    private final BigFiveTestService bigFiveTestService;

    @Transactional
    public void deleteChildren(Integer userId, Integer childrenId) {
        Child childOriginal = childrenService.getById(childrenId);

        if (!userId.equals(childOriginal.getUserId())) {
            throw new MinorException.DataException(ErrorCode.DATA_FORBIDDEN_ACCESS);
        }

//        childOriginal.deleteChild(); // 자녀 정보 삭제 (삭제 상태로 변경)

        deleteChildrenFile(childrenId);
    }

    // 자녀와 관련된 정보 일괄 삭제
//    @Scheduled(cron = "0 */30 * * * ?")
    @Transactional
    public void deleteChildrenFile(Integer childId) {
//        List<Integer> childIds = childrenService.getDeleteChildId();
//
//        if (childIds.isEmpty()) {
//            return;
//        }

        List<Integer> childIds = new ArrayList<>();
        childIds.add(childId);

        // 모든 HtpTest 조회
        List<String> htpFiles = htpSelectService.getHtpTestFileUrl(childIds);

        // 모든 BigFiveTest 조회
        List<String> bigFiveFiles = bigFiveTestService.getBigFiveTestPdfUrl(childIds);

        // S3에서 파일 한 번에 삭제
        List<String> allFiles = Stream.concat(htpFiles.stream(), bigFiveFiles.stream()).toList();
        if (!allFiles.isEmpty()) {
            s3Service.deleteFile(allFiles);
        }

        // 자녀 정보 삭제
        childrenService.deleteChild(childIds);
    }

}
